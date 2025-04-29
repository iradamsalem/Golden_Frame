import { detectFaceScore } from '../utils/faceUtils.js';

const calculateResolutionScore = (rawResolution, maxResolution) => {
  const score = Math.round((rawResolution / maxResolution) * 100);
  return Math.max(1, score);
};

const calculateBrightnessScore = (brightness, maxBrightness) => {
  const score = Math.round((brightness / maxBrightness) * 100);
  return Math.max(1, score);
};

const calculateSharpnessScore = (sharpness, maxSharpness) => {
  const score = Math.round((sharpness / maxSharpness) * 100);
  return Math.max(1, score);
};

const calculateFaceScore = (faceScore) => {
  const score = Math.round(faceScore);
  return Math.max(1, Math.min(100, score));
};

export const getScores = async (photos) => {
  const maxResolution = Math.max(...photos.map(photo => photo.rawResolution));
  const maxBrightness = Math.max(...photos.map(photo => photo.brightness));
  const maxSharpness = Math.max(...photos.map(photo => photo.sharpness));

  const photoScoresMap = new Map();

  for (const photo of photos) {
    const resolutionScore = calculateResolutionScore(photo.rawResolution, maxResolution);
    const brightnessScore = calculateBrightnessScore(photo.brightness, maxBrightness);
    const sharpnessScore = calculateSharpnessScore(photo.sharpness, maxSharpness);

    const faceScoreRaw = photo.faceScore ?? await detectFaceScore(photo.buffer);
    const faceScore = calculateFaceScore(faceScoreRaw);

    photoScoresMap.set(photo.originalName, {
      resolution: resolutionScore,
      brightness: brightnessScore,
      sharpness: sharpnessScore,
      face: faceScore,
    });
  }

  return photoScoresMap;
};
