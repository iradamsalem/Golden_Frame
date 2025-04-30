import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from 'path';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(process.cwd(), 'models');
let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;

  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(MODEL_PATH);
  modelsLoaded = true;
};

export const analyzeFaceData = async (buffer) => {
  await loadModels();

  const img = new Image();
  img.src = buffer;

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 320,
    scoreThreshold: 0.5,
  });

  const results = await faceapi
    .detectAllFaces(img, options)
    .withFaceLandmarks(true);

  const numFaces = results.length;

  const faceScore = (() => {
    if (numFaces === 0) return 1;
    if (numFaces === 1) return 100;
    if (numFaces >= 5) return 30;
    return 100 - (numFaces - 1) * 15;
  })();

  const alignmentScore = (() => {
    if (numFaces !== 1) return 30;
    const landmarks = results[0].landmarks;
    const left = landmarks.getLeftEye();
    const right = landmarks.getRightEye();
    const dy = Math.abs(left[0].y - right[0].y);
    const dx = Math.abs(left[0].x - right[0].x);
    const tiltRatio = dy / dx;
    return tiltRatio < 0.05 ? 95 : tiltRatio < 0.1 ? 80 : 40;
  })();

  const cropScore = numFaces === 1 ? 90 : 60;
  const expressionScore = numFaces > 0 ? 65 : 25;
  const filtersScore = numFaces === 1 ? 70 : 40;

  return {
    numFaces,
    faceScore,
    crop: cropScore,
    alignment: alignmentScore,
    expression: expressionScore,
    filters: filtersScore,
  };
};
