import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from 'path';
import fs from 'fs';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(process.cwd(), 'models'); // models are in the root folder
let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  modelsLoaded = true;
};

/**
 * Detect the number of faces in an image and return a score based on the number of faces detected.
 * @param {Buffer} buffer
 * @returns {Promise<number>}
 */
export const detectFaceScore = async (buffer) => {
  await loadModels();

  const img = await canvas.loadImage(buffer);
  const detections = await faceapi.detectAllFaces(img);
  const numFaces = detections.length;

  if (numFaces === 0) return 1;
  if (numFaces === 1) return 100;
  if (numFaces >= 5) return 30;

  return 100 - (numFaces - 1) * 15;
};
