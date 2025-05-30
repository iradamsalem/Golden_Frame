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
    landmarks: 0.03
  };

  const rgbEquals = (a, b) => (
    Math.abs(a.red - b.red) < 5 &&
    Math.abs(a.green - b.green) < 5 &&
    Math.abs(a.blue - b.blue) < 5
  );

  const preferredRGB = [
    { red: 0, green: 0, blue: 255 },       // #0000FF
    { red: 0, green: 255, blue: 0 },       // #00FF00
    { red: 128, green: 0, blue: 128 },     // #800080
    { red: 255, green: 255, blue: 255 },   // #FFFFFF
    { red: 211, green: 211, blue: 211 }    // #D3D3D3
  ];

  const avoidRGB = [
    { red: 255, green: 0, blue: 0 },       // #FF0000
    { red: 255, green: 165, blue: 0 },     // #FFA500
    { red: 255, green: 105, blue: 180 },   // #FF69B4
    { red: 255, green: 215, blue: 0 }      // #FFD700
  ];

  const evaluateColorsForTwitter = (colors) => {
    if (!colors || !Array.isArray(colors) || colors.length === 0) return 10;

    let score = 50;

    for (const c of colors) {
      if (preferredRGB.some(ref => rgbEquals(c.rgb, ref))) score += 10;
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

    const labelScore = scores.labelScore ?? 50;

    let faceBonus = 0;
    if (scores.numFaces === 1) faceBonus += 0.03;

    const combinedScore = baseScore * 0.6 + labelScore * 0.4 + faceBonus;
    const totalScore = Math.min(100, Math.max(1, combinedScore));

    console.log(`🐦 Twitter Photo: ${photoName}`);
    console.log(`   Resolution: ${scores.resolution}, Expression: ${scores.expression}, LabelScore: ${labelScore}`);
    console.log(`   Final Score: ${totalScore.toFixed(2)}\n`);

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
