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

  const rgbEquals = (a, b) => (
    Math.abs(a.red - b.red) < 5 &&
    Math.abs(a.green - b.green) < 5 &&
    Math.abs(a.blue - b.blue) < 5
  );

  const recommendedRGB = [
    { red: 255, green: 107, blue: 107 }, // #FF6B6B
    { red: 64, green: 224, blue: 208 },  // #40E0D0
    { red: 230, green: 230, blue: 250 }  // #E6E6FA
  ];
  const avoidRGB = [
    { red: 0, green: 0, blue: 0 },       // #000000
    { red: 0, green: 255, blue: 0 }      // #00FF00
  ];

  const evaluateColorsForDating = (colors) => {
    if (!colors || !Array.isArray(colors) || colors.length === 0) return 10;

    let score = 50;

    for (const c of colors) {
      if (recommendedRGB.some(ref => rgbEquals(c.rgb, ref))) score += 10;
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

    const labelScore = scores.labelScore ?? 50;

    let faceBonus = 0;
    if (scores.numFaces === 1) faceBonus += 0.05;

    const combinedScore = baseScore * 0.6 + labelScore * 0.4 + faceBonus;
    const totalScore = Math.min(100, Math.max(1, combinedScore));

    console.log(`❤️ Dating App Photo: ${photoName}`);
    console.log(`   Expression: ${scores.expression}, ColorScore: ${colorScoreValue}, LabelScore: ${labelScore}`);
    console.log(`   Final score (60% base + 40% label): ${totalScore.toFixed(2)}\n`);

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
