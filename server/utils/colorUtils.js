import sharp from 'sharp';

export const analyzeColors = async (buffer) => {
  try {
    const image = sharp(buffer);
    const { data, info } = await image
      .resize(100, 100)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calculate color statistics
    let totalR = 0, totalG = 0, totalB = 0;
    let maxR = 0, maxG = 0, maxB = 0;
    let minR = 255, minG = 255, minB = 255;

    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      totalR += r;
      totalG += g;
      totalB += b;

      maxR = Math.max(maxR, r);
      maxG = Math.max(maxG, g);
      maxB = Math.max(maxB, b);

      minR = Math.min(minR, r);
      minG = Math.min(minG, g);
      minB = Math.min(minB, b);
    }

    const pixelCount = data.length / 3;
    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;

    // Calculate contrast
    const contrast = (maxR - minR + maxG - minG + maxB - minB) / (3 * 255);

    // Calculate color balance
    const colorBalance = {
      r: avgR / 255,
      g: avgG / 255,
      b: avgB / 255
    };

    // Calculate saturation
    const maxChannel = Math.max(avgR, avgG, avgB);
    const minChannel = Math.min(avgR, avgG, avgB);
    const saturation = maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel;

    return {
      contrast,
      colorBalance,
      saturation,
      averageColor: {
        r: avgR,
        g: avgG,
        b: avgB
      }
    };
  } catch (error) {
    console.error('Error analyzing colors:', error);
    return null;
  }
}; 