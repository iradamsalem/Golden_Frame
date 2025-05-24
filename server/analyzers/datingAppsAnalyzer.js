export const analyzeDatingApp = (photoScoresMap) => {
    const weights = {
      expression: 0.20,
      alignment: 0.15,
      face: 0.15,
      variance: 0.15,        
      resolution: 0.05,
      colorScore: 0.05,
      sharpness: 0.05,
      filters: 0.05,
      numFaces: 0.05,
      crop: 0.02,
      landmarks: 0.01
    };
  
    const evaluateColorsForDating = (colors) => {
      if (!colors || !Array.isArray(colors) || colors.length === 0) return 10;
  
      const recommendedHex = ['#FF6B6B', '#40E0D0', '#E6E6FA']; 
      const avoidHex = ['#000000', '#00FF00'];
  
      let score = 50;
  
      for (const c of colors) {
        const hex = c.hex.toUpperCase();
        if (recommendedHex.includes(hex)) score += 10;
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
      const colorScoreValue = evaluateColorsForDating(scores.colors);
      const colorScore = colorScoreValue * weights.colorScore;
  
      const baseScore =
        (scores.expression ?? 0) * weights.expression +
        (scores.alignment ?? 0) * weights.alignment +
        (scores.face ?? 0) * weights.face +
        (scores.variance ?? 0) * weights.variance +
        (scores.resolution ?? 0) * weights.resolution +
        colorScore +
        (scores.sharpness ?? 0) * weights.sharpness +
        (scores.filters ?? 0) * weights.filters +
        (scores.numFaces ?? 0) * weights.numFaces +
        (scores.crop ?? 0) * weights.crop +
        landmarkScore * weights.landmarks;
  
      let faceBonus = 0;
      if (scores.numFaces === 1) faceBonus += 0.05;
  
      const totalScore = Math.min(100, Math.max(1, baseScore + faceBonus));
  
      console.log(`❤️ Dating App Photo: ${photoName}`);
      console.log(`   Expression: ${scores.expression}, ColorScore: ${colorScoreValue}, Final: ${totalScore.toFixed(2)}`);
  
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
  