import sizeOf from 'image-size';

/**
 * Get width and height of an image from a Buffer.
 * @param {Buffer} buffer - The image buffer.
 * @returns {Object} - { width, height }
 */
export function getImageDimensions(buffer) {
  try {
    const dimensions = sizeOf(buffer);
    return {
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return { width: 0, height: 0 };
  }
}

/**
 * Calculate a resolution score between 1 and 100 based on the maximum resolution.
 * @param {number} width
 * @param {number} height
 * @param {number} maxResolution
 * @returns {number} - Score between 1 and 100
 */
export function calculateResolutionScore(width, height, maxResolution) {
  const currentResolution = width * height;
  
  if (maxResolution === 0) {
    return 1; // Avoid division by zero
  }

  const score = Math.round((currentResolution / maxResolution) * 100);

  return Math.max(1, score); // Always return at least 1
}
