export const analyzeLinkedin = (photoScoresMap) => {
  const weights = {
    resolution: 0.20,
    variance: 0.15,
    face: 0.15,
    colorScore: 0.10,
    expression: 0.10,
    brightness: 0.05,
    sharpness: 0.05,
    alignment: 0.05,
    numFaces: 0.05,
    crop: 0.05,
    landmarks: 0.03,
    filters: 0.02
  };

  const rgbEquals = (a, b) => (
    Math.abs(a.red - b.red) < 5 &&
    Math.abs(a.green - b.green) < 5 &&
    Math.abs(a.blue - b.blue) < 5
  );

  const preferredRGB = [
    { red: 47, green: 60, blue: 78 },   // #2F3C4E
    { red: 74, green: 74, blue: 74 },   // #4A4A4A
    { red: 255, green: 255, blue: 255 } // #FFFFFF
  ];

  const avoidRGB = [
    { red: 255, green: 0, blue: 0 },     // #FF0000
    { red: 255, green: 255, blue: 0 }    // #FFFF00
  ];

  const bonusRGB = [
    { red: 255, green: 218, blue: 185 }, // #FFDAB9
    { red: 95, green: 158, blue: 160 },  // #5F9EA0
    { red: 107, green: 142, blue: 35 }   // #6B8E23
  ];

  const evaluateColorsForLinkedin = (colors) => {
    if (!colors || !Array.isArray(colors) || colors.length === 0) return 10;

    let score = 50;

    for (const c of colors) {
      if (preferredRGB.some(ref => rgbEquals(c.rgb, ref))) score += 10;
      if (bonusRGB.some(ref => rgbEquals(c.rgb, ref))) score += 5;
      if (avoidRGB.some(ref => rgbEquals(c.rgb, ref))) score -= 10;

      const { red, green, blue } = c.rgb;
      const neutral = Math.abs(red - green) < 12 && Math.abs(green - blue) < 12;
      if (neutral) score += 3;
    }

    return Math.max(1, Math.min(score, 100));
  };

  const results = [];

  for (const [photoName, scores] of photoScoresMap.entries()) {
    const landmarkScore = scores.landmarks?.length ? 80 : 20;
    const colorScoreValue = evaluateColorsForLinkedin(scores.colors);
    const colorScore = colorScoreValue * weights.colorScore;

    const baseScore =
      (scores.resolution ?? 0) * weights.resolution +
      (scores.variance ?? 0) * weights.variance +
      (scores.face ?? 0) * weights.face +
      colorScore +
      (scores.expression ?? 0) * weights.expression +
      (scores.brightness ?? 0) * weights.brightness +
      (scores.sharpness ?? 0) * weights.sharpness +
      (scores.alignment ?? 0) * weights.alignment +
      (scores.numFaces ?? 0) * weights.numFaces +
      (scores.crop ?? 0) * weights.crop +
      landmarkScore * weights.landmarks +
      (scores.filters ?? 0) * weights.filters;

    const labelScore = scores.labelScore ?? 50;

    let faceBonus = 0;
    if (scores.numFaces > 0) faceBonus += 0.03;
    if (scores.numFaces === 1) faceBonus += 0.05;

    const combinedScore = baseScore * 0.6 + labelScore * 0.4 + faceBonus;
    const totalScore = Math.min(100, Math.max(1, combinedScore));

    console.log(`👔 LinkedIn Photo: ${photoName}`);
    console.log(`   Sharpness: ${scores.sharpness}, Variance: ${scores.variance}, ColorScore: ${colorScoreValue}, LabelScore: ${labelScore}`);
    console.log(`   Final LinkedIn score: ${totalScore.toFixed(2)}\n`);

    results.push({
      name: photoName,
      score: totalScore,
      buffer: scores.buffer,
      mimeType: scores.mimeType,
      labels: scores.labels?.map(l => l.description) || [] 
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
};
