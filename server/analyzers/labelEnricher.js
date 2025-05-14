/**
 * labelEnricher.js
 * 
 * Enhances label annotations by inferring higher-level concepts
 * based on related descriptive labels.
 * 
 * Used to improve scoring logic across all analyzers (Instagram, LinkedIn, etc.)
 */

const inferredLabelMap = {
    person: ['smile', 'eyebrow', 'beard', 'facial hair', 't-shirt', 'eye', 'forehead', 'hair', 'jaw', 'face'],
    portrait: ['face', 'forehead', 'eye', 'nose', 'mouth', 'chin'],
    fashion: ['t-shirt', 'shirt', 'jeans', 'jacket', 'clothing', 'sleeve', 'tie', 'blazer'],
    indoor: ['wall', 'sofa', 'lamp', 'floor', 'ceiling', 'curtain', 'furniture', 'window'],
    outdoor: ['tree', 'sky', 'grass', 'mountain', 'road', 'building', 'cloud', 'nature'],
    selfie: ['face', 'close-up', 'camera', 'arm', 'hand', 'phone'],
    colorful: ['vibrant', 'rainbow', 'bright', 'multicolored', 'colorful'],
    scenery: ['landscape', 'mountain', 'sky', 'outdoor', 'nature'],
    professional: ['suit', 'tie', 'shirt', 'business attire', 'formal wear']
  };
  
  /**
   * inferLabels
   * Adds inferred high-level labels if a combination of related labels is detected.
   * @param {Array} originalLabels - Original array of label objects from Google Vision API.
   * @returns {Array} Enriched array of labels with inferred ones added.
   */
  export const inferLabels = (originalLabels = []) => {
    const result = [...originalLabels];
    const existing = new Set(originalLabels.map(l => l.description.toLowerCase()));
  
    for (const [mainLabel, indicators] of Object.entries(inferredLabelMap)) {
      const hasMatch = indicators.some(i => existing.has(i));
      const alreadyExists = existing.has(mainLabel);
      
      if (hasMatch && !alreadyExists) {
        result.push({
          description: mainLabel,
          score: 0.8 // estimated relevance
        });
      }
    }
  
    return result;
  };
  