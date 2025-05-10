// server/utils/visionUtils.js
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * visionUtils
 * 
 * Utility functions for vision analysis using Google Vision API.
 * 
 * @module visionUtils
 */
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;;
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

// Converts a buffer to a Base64 string
const bufferToBase64 = (buffer) => {
  return buffer.toString('base64');
};

// Analyzes a single image
export const analyzeImage = async (buffer) => {
  const base64Image = bufferToBase64(buffer);

  const requestBody = {
    requests: [
      {
        image: { content: base64Image },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 5 },
          { type: 'FACE_DETECTION' },
          { type: 'LANDMARK_DETECTION' },
          { type: 'IMAGE_PROPERTIES' },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(API_URL, requestBody);
    return response.data.responses[0];
  } catch (err) {
    console.error('❌ Vision API error:', err.response?.data || err.message);
    return null;
  }
};
