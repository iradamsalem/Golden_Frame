import { analyzeFaceData } from '../utils/faceUtils.js';
import { calculateResolution } from '../utils/resolutionUtils.js';
import { calculateBrightness } from '../utils/brightnessUtils.js';
import { calculateSharpness } from '../utils/sharpnessUtils.js';
import { getScores } from '../analyzers/getScores.js';
import {Analyzer} from '../analyzers/photoAnalyzer.js'

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
      buffer: photo.buffer,
      mimeType: photo.mimetype,
      originalName: photo.originalname,
      size: photo.size,
      bufferLength: photo.buffer.length,
      rawResolution,
      brightness,
      sharpness,
      ...faceData
    };

    enrichedPhotos.push(enriched);
  }

  const photoScoresMap = await getScores(enrichedPhotos);

  const result=Analyzer(photoScoresMap);
  
  console.log("photos : ",result);

  console.log('🎯 Processed and scored photos:', Array.from(photoScoresMap.entries()));
  return result;
};
