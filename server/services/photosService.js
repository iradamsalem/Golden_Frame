import fs from 'fs/promises';
import path from 'path';
import { analyzeImage } from '../utils/visionUtils.js';
import { calculateResolution } from '../utils/resolutionUtils.js';
import { calculateBrightness } from '../utils/brightnessUtils.js';
import { calculateSharpness } from '../utils/sharpnessUtils.js';
import { getScores } from '../analyzers/getScores.js';
import { Analyzer } from '../analyzers/photoAnalyzer.js';
import { inferLabels } from '../analyzers/labelEnricher.js';
import { normalizePurpose } from '../utils/normalizePurpose.js';
import { getFavoriteLabelsByPurpose } from '../storage/userStorage.js'; // התאמת הנתיב למקום הפונקציה שלך

const RAG_FOLDER = path.resolve('./rag');
const USER_LABELS_FILE = path.join(RAG_FOLDER, 'user_labels.json');

async function writeUserLabelsToFile(username, purpose) {
  try {
    const normalizedPurpose = normalizePurpose(purpose);
    const labels = await getFavoriteLabelsByPurpose(username, normalizedPurpose) || [];

    const dataToSave = {
      username,
      purpose: normalizedPurpose,
      labels,
      timestamp: new Date().toISOString(),
    };

    // אם תיקיית rag כבר קיימת אין צורך ליצור, אז אפשר להשאיר את זה או להסיר לפי מצבך:
    // await fs.mkdir(RAG_FOLDER, { recursive: true });

    await fs.writeFile(USER_LABELS_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');

    console.log(`✅ User labels file updated for user "${username}" and purpose "${normalizedPurpose}"`);
  } catch (error) {
    console.error('❌ Failed to write user labels file:', error);
  }
}

export const processPhotos = async (photos, purpose, username) => {
  // קודם כל: כתיבת קובץ התוויות לפי משתמש ומטרה
  await writeUserLabelsToFile(username, purpose);

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
  console.log(purpose);
  const photoScoresMap = await getScores(enrichedPhotos,purpose);
  const result = Analyzer(photoScoresMap,purpose);

  console.log("📊 Final results with full enrichment:", result);
  return result;
};
