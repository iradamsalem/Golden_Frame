
/**
 * getScores Function
 * 
 * Normalizes various quality metrics (resolution, brightness, sharpness) for a set of photos
 * and returns a Map keyed by each photo's `originalName`. Each value in the Map is an object
 * containing the normalized scores and relevant metadata for the photo.
 */
export const getScores = async (photos) => {
  const maxResolution = Math.max(...photos.map(p => p.rawResolution));
  const maxBrightness = Math.max(...photos.map(p => p.brightness));
  const maxSharpness = Math.max(...photos.map(p => p.sharpness));

  const photoScoresMap = new Map();

  for (const photo of photos) {
    const resolution = Math.max(1, Math.round((photo.rawResolution / maxResolution) * 100));
    const brightness = Math.max(1, Math.round((photo.brightness / maxBrightness) * 100));
    const sharpness = Math.max(1, Math.round((photo.sharpness / maxSharpness) * 100));

    photoScoresMap.set(photo.originalName, {
      buffer: photo.buffer,
      mimeType: photo.mimeType,
      resolution,
      brightness,
      sharpness,
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

  return photoScoresMap;
};
