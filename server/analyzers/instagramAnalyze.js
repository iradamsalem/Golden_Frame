export const analyzeInstagram = (photoScoresMap) => {
  const weights = {
    resolution: 0.11,
    brightness: 0.05,
    sharpness: 0.10,
    variance: 0.18,
    colorScore: 0.10,
    face: 0.28,
    expression: 0.06,
    alignment: 0.08,
    crop: 0.07,
    filters: 0.02,
    numFaces: 0.03,
    landmarks: 0.02
  };

  const evaluateColorsForInstagram = (colors) => {
    if (!colors || !Array.isArray(colors) || colors.length === 0) return 10;

    const vibrantColors = colors.filter(c => c.score > 0.15);
    const neutralColors = colors.filter(c => {
      const { red, green, blue } = c.rgb;
      return (
        Math.abs(red - green) < 12 &&
        Math.abs(green - blue) < 12 &&
        Math.abs(red - blue) < 12
      );
    });

    let score = 50;

    if (vibrantColors.length >= 3) score += 25;
    else if (vibrantColors.length === 2) score += 15;
    else if (vibrantColors.length === 1) score += 5;

    if (neutralColors.length >= 2) score += 15;
    else if (neutralColors.length === 1) score += 5;

    return Math.max(1, Math.min(score, 100));
  };

  const results = [];

  for (const [photoName, scores] of photoScoresMap.entries()) {
    const landmarkScore = scores.landmarks?.length ? 80 : 20;

    const sharpnessScore = (scores.sharpness ?? 0) * weights.sharpness;
    const varianceScore = (scores.variance ?? 0) * weights.variance;
    const colorScoreValue = evaluateColorsForInstagram(scores.colors);
    const colorScore = colorScoreValue * weights.colorScore;

    const baseScore =
      (scores.resolution ?? 0) * weights.resolution +
      (scores.brightness ?? 0) * weights.brightness +
      sharpnessScore +
      varianceScore +
      colorScore +
      (scores.face ?? 0) * weights.face +
      (scores.expression ?? 0) * weights.expression +
      (scores.alignment ?? 0) * weights.alignment +
      (scores.crop ?? 0) * weights.crop +
      (scores.filters ?? 0) * weights.filters +
      (scores.numFaces ?? 0) * weights.numFaces +
      landmarkScore * weights.landmarks;

    let faceBonus = 0;
    if (scores.numFaces > 0) faceBonus += 0.05;
    if (scores.numFaces === 1) faceBonus += 0.1;

    const totalScore = Math.min(100, Math.max(1, baseScore + faceBonus));

    console.log(`📷 Photo: ${photoName}`);
    console.log(`   Sharpness: ${scores.sharpness}, Variance: ${scores.variance}, ColorScore: ${colorScoreValue}`);
    console.log(`   Final score: ${totalScore.toFixed(2)}\n`);

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