import sharp from 'sharp';

export const calculateSharpness = async (buffer) => {
  try {
    const image = sharp(buffer);
    const { data, info } = await image
      .greyscale()
      .resize(100, 100)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const n = data.length;

    // חישוב חדות (סטיית תקן של הפרשים בין פיקסלים סמוכים)
    let sumSqDiff = 0;
    for (let i = 0; i < n - 1; i++) {
      const diff = data[i] - data[i + 1];
      sumSqDiff += diff * diff;
    }
    const sharpness = Math.sqrt(sumSqDiff / (n - 1));

    // חישוב שונות כללית של ערכי הפיקסלים (variance)
    let sum = 0;
    let sumSq = 0;
    for (let i = 0; i < n; i++) {
      const val = data[i];
      sum += val;
      sumSq += val * val;
    }
    const mean = sum / n;
    const variance = (sumSq / n) - (mean * mean);

    return { sharpness, variance };
  } catch (error) {
    console.error('Error calculating sharpness and variance:', error);
    return { sharpness: 0, variance: 0 };
  }
};
