import { runLabelSimilarity } from "../utils/runLabelSimilarity.js";

export const getScores = async (photos,purpose) => {
  console.log('🎯 Purpose for scoring:', purpose);
  const maxResolution = Math.max(...photos.map(p => p.rawResolution));
  const maxBrightness = Math.max(...photos.map(p => p.brightness));
  const maxSharpness = Math.max(...photos.map(p => p.sharpness));
  const maxVariance = Math.max(...photos.map(p => p.variance));

  const photoScoresMap = new Map();

  for (const photo of photos) {
    const resolution = Math.max(1, Math.round((photo.rawResolution / maxResolution) * 100));
    const brightness = Math.max(1, Math.round((photo.brightness / maxBrightness) * 100));
    const sharpness = Math.max(1, Math.round((photo.sharpness / maxSharpness) * 100));
    const varianceRatio = photo.variance / maxVariance;
    const variance = Math.max(1, Math.round(Math.pow(varianceRatio, 0.8) * 100));

    photoScoresMap.set(photo.originalName, {
      buffer: photo.buffer,
      mimeType: photo.mimeType,
      resolution,
      brightness,
      sharpness,
      variance,
      face: photo.faceScore ?? 1,
      crop: photo.crop,
      expression: photo.expression,
      filters: photo.filters,
      alignment: photo.alignment,
      numFaces: photo.numFaces,
      labels: photo.labels,
      landmarks: photo.landmarks,
      colors: photo.colors
    });
  }

  
  const labelInput = {
    category: purpose.toLowerCase(),
    images: {}
  };

  for (const [photoName, data] of photoScoresMap.entries()) {
    labelInput.images[photoName] = data.labels?.map(l => l.description) || [];
  }

  try {
    const labelScores = await runLabelSimilarity(labelInput);

    for (const [photoName, score] of Object.entries(labelScores)) {
      if (photoScoresMap.has(photoName)) {
        photoScoresMap.get(photoName).labelScore = score;
      }
    }
  } catch (err) {
    console.error('⚠️ Label similarity failed:', err.message);
    for (const data of photoScoresMap.values()) {
      data.labelScore = 50; 
    }
  }
  console.log('📦 Final photoScoresMap:');
for (const [name, data] of photoScoresMap.entries()) {
  console.log(`🖼️ ${name}:`, {
    resolution: data.resolution,
    brightness: data.brightness,
    sharpness: data.sharpness,
    variance: data.variance,
    face: data.face,
    crop: data.crop,
    expression: data.expression,
    filters: data.filters,
    alignment: data.alignment,
    numFaces: data.numFaces,
    labelScore: data.labelScore,
    labels: data.labels.map(l => l.description)
  });
}


  return photoScoresMap;
};
