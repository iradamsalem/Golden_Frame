import { getImageDimensions, calculateResolutionScore } from '../utils/resolutionUtils.js';

export const processPhotos = async (photos) => {
    console.log('Processing photos...');

    const enrichedPhotos = photos.map((photo) => {
        const { width, height } = getImageDimensions(photo.buffer);

        return {
            originalName: photo.originalname,
            size: photo.size,
            mimeType: photo.mimetype,
            bufferLength: photo.buffer.length,
            width: width,
            height: height,
            rawResolution: width * height,
        };
    });

    const maxResolution = Math.max(...enrichedPhotos.map(photo => photo.rawResolution));

    const photoDataMap = new Map();   
    const photoScoresMap = new Map(); 

    enrichedPhotos.forEach((photo) => {
        const resolutionScore = calculateResolutionScore(photo.width, photo.height, maxResolution);

        
        photoDataMap.set(photo.originalName, {
            originalName: photo.originalName,
            size: photo.size,
            mimeType: photo.mimeType,
            bufferLength: photo.bufferLength,
            width: photo.width,
            height: photo.height,
            
            resolution: resolutionScore,
        });

        photoScoresMap.set(photo.originalName, {
            resolution: resolutionScore,
            
        });
    });

    console.log('✅ Photo Data Map:', Array.from(photoDataMap.entries()));
    console.log('✅ Photo Scores Map:', Array.from(photoScoresMap.entries()));

    return { photoDataMap, photoScoresMap };
};
