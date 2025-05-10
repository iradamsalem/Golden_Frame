import sharp from 'sharp';

/**
 * calculateSharpness Function
 * 
 * Calculates the sharpness of an image.
 */

export const calculateSharpness = async (buffer) => {
  try {
    
    const image = sharp(buffer);
    const { data, info } = await image
      .greyscale()  
      .resize(100, 100) 
      .raw()
      .toBuffer({ resolveWithObject: true });

    let sharpness = 0;
    
    for (let i = 0; i < data.length - 1; i++) {
      sharpness += Math.abs(data[i] - data[i + 1]);
    }

    
    return sharpness / data.length; 
  } catch (error) {
    console.error('Error calculating sharpness:', error);
    return 0; 
  }
};