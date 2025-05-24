export const analyzeTwitter = (photoScoresMap) => {
    const weights = {
      resolution: 0.20,     
      variance: 0.15,       
      face: 0.15,           
      expression: 0.10,   
      colorScore: 0.10,     
      sharpness: 0.05,      
      numFaces: 0.05,       
      crop: 0.05,           
      alignment: 0.05,     
      filters: 0.05,        
      landmarks: 0.03,      
      personalTouch: 0.02   
    };
  
    const evaluateColorsForTwitter = (colors) => {
      if (!colors || !Array.isArray(colors) || colors.length === 0) return 10;
  
      const preferredHex = ['#0000FF', '#00FF00', '#800080', '#FFFFFF', '#D3D3D3']; // כחול, ירוק, סגול, לבן, אפור בהיר
      const avoidHex = ['#FF0000', '#FFA500', '#FF69B4', '#FFD700']; // אדום עז, כתום, ורוד בוהק, זהב
  
      let score = 50;
  
      for (const c of colors) {
        const hex = c.hex.toUpperCase();
        if (preferredHex.includes(hex)) score += 10;
        if (avoidHex.includes(hex)) score -= 10;
  
        const { red, green, blue } = c.rgb;
        const neutral = Math.abs(red - green) < 12 && Math.abs(green - blue) < 12;
        if (neutral) score += 3;
      }
  
      return Math.max(1, Math.min(score, 100));
    };
  
    const results = [];
  
    for (const [photoName, scores] of photoScoresMap.entries()) {
      const landmarkScore = scores.landmarks?.length ? 80 : 20;
      const colorScoreValue = evaluateColorsForTwitter(scores.colors);
      const colorScore = colorScoreValue * weights.colorScore;
  
      const baseScore =
        (scores.resolution ?? 0) * weights.resolution +
        (scores.variance ?? 0) * weights.variance +
        (scores.face ?? 0) * weights.face +
        (scores.expression ?? 0) * weights.expression +
        colorScore +
        (scores.sharpness ?? 0) * weights.sharpness +
        (scores.filters ?? 0) * weights.filters +
        (scores.numFaces ?? 0) * weights.numFaces +
        (scores.crop ?? 0) * weights.crop +
        (scores.alignment ?? 0) * weights.alignment +
        landmarkScore * weights.landmarks;
  
      let faceBonus = 0;
      if (scores.numFaces === 1) faceBonus += 0.03;
  
      const totalScore = Math.min(100, Math.max(1, baseScore + faceBonus));
  
      console.log(`🐦 Twitter Photo: ${photoName}`);
      console.log(`   Resolution: ${scores.resolution}, Expression: ${scores.expression}, ColorScore: ${colorScoreValue}`);
      console.log(`   Final Score: ${totalScore.toFixed(2)}\n`);
  
      results.push({
        name: photoName,
        score: totalScore,
        buffer: scores.buffer,
        mimeType: scores.mimeType
      });
    }
  
    results.sort((a, b) => b.score - a.score);
    return results;
  };
  