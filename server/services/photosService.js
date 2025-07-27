import { analyzeImage } from '../utils/visionUtils.js';
import { calculateResolution } from '../utils/resolutionUtils.js';
import { calculateBrightness } from '../utils/brightnessUtils.js';
import { calculateSharpness } from '../utils/sharpnessUtils.js';
import { getScores } from '../analyzers/getScores.js';
import { Analyzer } from '../analyzers/photoAnalyzer.js';
import { inferLabels } from '../analyzers/labelEnricher.js';
import { normalizePurpose } from '../utils/normalizePurpose.js';
import { getFavoriteLabelsByPurpose } from '../storage/userStorage.js';
import { runLabelSimilarity } from '../utils/runLabelSimilarity.js'; // ✅ ודא שזה הנתיב הנכון

async function getUserLabels(username, purpose) {
  const normalizedPurpose = normalizePurpose(purpose);
  const labels = await getFavoriteLabelsByPurpose(username, normalizedPurpose) || [];
  return {
    username,
    purpose: normalizedPurpose,
    labels,
    timestamp: new Date().toISOString(),
  };
}

export const processPhotos = async (photos, purpose, username) => {
  console.log('🔄 Processing photos...');
  console.log('Purpose:', purpose);
  console.log('Username:', username);

  const enrichedPhotos = [];

  for (const photo of photos) {
    console.log(`📸 Analyzing photo: ${photo.originalname}`);

    const rawResolution = calculateResolution(photo.buffer);
    const brightness = await calculateBrightness(photo.buffer);
    const { sharpness, variance } = await calculateSharpness(photo.buffer);
    const visionData = await analyzeImage(photo.buffer);

    const faceAnnotations = visionData.faceAnnotations?.[0];
    const numFaces = visionData.faceAnnotations?.length || 0;
    const faceScore = numFaces === 1 ? 100 : numFaces >= 5 ? 30 : numFaces === 0 ? 1 : 100 - (numFaces - 1) * 15;
    const alignment = faceAnnotations?.rollAngle && Math.abs(faceAnnotations.rollAngle) < 5 ? 95 : 40;
    const expression = faceAnnotations ? 65 : 25;
    const crop = numFaces === 1 ? 90 : 60;
    const filters = numFaces === 1 ? 70 : 40;

    const rawLabels = visionData.labelAnnotations?.map(l => ({
      description: l.description,
      score: l.score
    })) || [];

    const labels = inferLabels(rawLabels);

    const landmarks = visionData.landmarkAnnotations?.map(l => ({
      description: l.description,
      score: l.score
    })) || [];

    const colors = visionData.imagePropertiesAnnotation?.dominantColors?.colors?.map(c => ({
      rgb: c.color,
      score: c.score
    })) || [];

    const enriched = {
      buffer: photo.buffer,
      mimeType: photo.mimetype,
      originalName: photo.originalname,
      size: photo.size,
      bufferLength: photo.buffer.length,
      rawResolution,
      brightness,
      sharpness,
      variance,
      faceScore,
      alignment,
      expression,
      crop,
      filters,
      numFaces,
      labels,
      landmarks,
      colors
    };

    console.log("🧠 Enriched photo data:", {
      originalName: enriched.originalName,
      faceScore: enriched.faceScore,
      alignment: enriched.alignment,
      brightness: enriched.brightness,
      sharpness: enriched.sharpness,
      variance: enriched.variance,
      crop: enriched.crop,
      filters: enriched.filters,
      expression: enriched.expression,
      numFaces: enriched.numFaces,
      labels: enriched.labels,
      landmarks: enriched.landmarks,
      colors: enriched.colors
    });

    enrichedPhotos.push(enriched);
  }

  const userLabels = await getUserLabels(username, purpose);

  const images = {};
  for (const photo of enrichedPhotos) {
    images[photo.originalName] = photo.labels.map(l => l.description);
  }

  const similarityInput = {
    images,
    category: purpose,
    userLabels
  };
  console.log("📤 Sending input to Python:", JSON.stringify(similarityInput, null, 2));
  const similarityResult = await runLabelSimilarity(similarityInput);

  const photoScoresMap = await getScores(enrichedPhotos, purpose, similarityResult);
  const result = Analyzer(photoScoresMap, purpose);

  console.log("📊 Final results with full enrichment:", result);
  return result;
};
