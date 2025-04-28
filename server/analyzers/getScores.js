

export const calculateResolutionScore = (rawResolution, maxResolution) => {
    const score = Math.round((rawResolution / maxResolution) * 100);
    return Math.max(1, score); 
  };
  
  
  export const calculateBrightnessScore = (brightness,maxBrightness) => {
    const score = Math.round((brightness / maxBrightness) * 100);
    return Math.max(1, score); 
  };
  
  
  export const calculateSharpnessScore = (sharpness,maxSharpness) => {
    const score = Math.round((sharpness / maxSharpness) * 100);
    return Math.max(1, score); 
  };
  
  
  export const getScores = (photos) => {
    const maxResolution = Math.max(...photos.map(photo => photo.rawResolution));
    const maxBrightness = Math.max(...photos.map(photo => photo.brightness));
    const maxSharpness = Math.max(...photos.map(photo => photo.sharpness));
    const photoScoresMap = new Map();  
  
    photos.forEach((photo) => {
      const resolutionScore = calculateResolutionScore(photo.rawResolution, maxResolution);
      const brightnessScore = calculateBrightnessScore(photo.brightness,maxBrightness);
      const sharpnessScore = calculateSharpnessScore(photo.sharpness,maxSharpness);
  
      
      photoScoresMap.set(photo.originalName, {
        resolution: resolutionScore,  
        brightness: brightnessScore,  
        sharpness: sharpnessScore,  
      });
    });
  
    return photoScoresMap;  
  };
  