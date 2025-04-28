import sizeOf from 'image-size';

/**
 * Get the resolution of an image from a Buffer.
 * @param {Buffer} buffer - The image buffer.
 * @returns {number} - The resolution (width * height) of the image.
 */
export function calculateResolution(buffer) {
  try {
    const dimensions = sizeOf(buffer);
    const resolution = dimensions.width * dimensions.height;  
    return resolution;
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return 0;  
  }
};
