export const analyzeInstagram = (photoScoresMap) => {
  const weights = {
    resolution: 0.2,
    brightness: 0.1,
    sharpness: 0.15,
    face: 0.3,
    expression: 0.1,
    alignment: 0.1,
    filters: 0.05
  };

  const results = [];

  for (const [photoName, scores] of photoScoresMap.entries()) {
    const baseScore =
      (scores.resolution ?? 0) * weights.resolution +
      (scores.brightness ?? 0) * weights.brightness +
      (scores.sharpness ?? 0) * weights.sharpness +
      (scores.face ?? 0) * weights.face +
      (scores.expression ?? 0) * weights.expression +
      (scores.alignment ?? 0) * weights.alignment +
      (scores.filters ?? 0) * weights.filters;

    let faceBonus = 0;
    if (scores.numFaces > 0) {
      faceBonus += 0.05;
      if (scores.numFaces === 1) {
        faceBonus += 0.1;
      }
    }

    const totalScore = baseScore + faceBonus;

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
