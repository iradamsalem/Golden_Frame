import { analyzeFaceData } from '../utils/faceUtils.js';
import { calculateResolution } from '../utils/resolutionUtils.js';
import { calculateBrightness } from '../utils/brightnessUtils.js';
import { calculateSharpness } from '../utils/sharpnessUtils.js';
import { getScores } from '../analyzers/getScores.js';

export const processPhotos = async (photos) => {
  console.log('🔄 Processing photos...');

  const enrichedPhotos = [];

  for (const photo of photos) {
    console.log(`📸 Analyzing photo: ${photo.originalname}`);

    const rawResolution = calculateResolution(photo.buffer);
    const brightness = await calculateBrightness(photo.buffer);
    const sharpness = await calculateSharpness(photo.buffer);
    const faceData = await analyzeFaceData(photo.buffer);

    const enriched = {
      originalName: photo.originalname,
      size: photo.size,
      mimeType: photo.mimetype,
      bufferLength: photo.buffer.length,
      rawResolution,
      brightness,
      sharpness,
      ...faceData
    };

    enrichedPhotos.push(enriched);
  }

  const photoScoresMap = await getScores(enrichedPhotos);

  console.log('🎯 Processed and scored photos:', Array.from(photoScoresMap.entries()));
  return photoScoresMap;
};
