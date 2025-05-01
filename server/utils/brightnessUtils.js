import sharp from 'sharp';

/**
 * Calculate the brightness of an image based on its pixels.
 * @param {Buffer} buffer - The image buffer.
 * @returns {number} - The average brightness of the image (without scaling to score).
 */
export const calculateBrightness = async (buffer) => {
  return new Promise((resolve, reject) => {
    sharp(buffer)
      .resize(100, 100)  // Resize to a smaller size for faster processing
      .toBuffer((err, data, info) => {
        if (err) {
          return reject('Error processing image: ' + err);
        }

        sharp(data)
          .raw()  // Get raw image data
          .toBuffer((err, rawData, { width, height }) => {
            if (err) {
              return reject('Error extracting raw data: ' + err);
            }

            let totalBrightness = 0;
            const totalPixels = width * height;

            // Sum the RGB values for each pixel
            for (let i = 0; i < rawData.length; i += 3) {
              const r = rawData[i];
              const g = rawData[i + 1];
              const b = rawData[i + 2];
              
              // Calculate the average RGB value for brightness
              totalBrightness += (r + g + b) / 3;
            }

            // Return the raw brightness value (no scaling to score)
            resolve(totalBrightness / totalPixels);  // Average brightness without scaling
          });
      });
  });
};
