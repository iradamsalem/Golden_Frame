import { getScores } from '../analyzers/getScores.js';  
import { calculateResolution } from '../utils/resolutionUtils.js';  
import { calculateBrightness } from '../utils/brightnessUtils.js';  
import { calculateSharpness } from '../utils/sharpnessUtils.js'; 


export const processPhotos = async (photos) => {
    console.log('Processing photos...');

   
    const enrichedPhotos = [];

    
    for (const photo of photos) {

        const rawResolution = calculateResolution(photo.buffer);  

        
        const brightness = await calculateBrightness(photo.buffer);  
        const sharpness = await calculateSharpness(photo.buffer);  

        enrichedPhotos.push({
            originalName: photo.originalname,  
            size: photo.size,  
            mimeType: photo.mimetype, 
            bufferLength: photo.buffer.length,  
            rawResolution,  
            brightness, 
            sharpness,
        });
    }

    


    
    const photoScoresMap = getScores(enrichedPhotos);  
    console.log('Enriched photos:', enrichedPhotos);
    console.log('Processed and scored photos:', Array.from(photoScoresMap.entries()));  

    return photoScoresMap; 
};
