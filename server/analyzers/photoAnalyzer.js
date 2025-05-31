import { analyzeInstagram } from "./instagramAnalyze.js";
import { analyzeLinkedin } from "./linkedinAnalyze.js";
import { analyzeDatingApp } from "./datingAppsAnalyzer.js";
import { analyzeResumePhoto } from "./resumeAnalyze.js";
import { analyzeFacebook } from "./facebookAnalyze.js";
import { analyzeTwitter } from "./twitterAnlayze.js";
import { analyzeProfessionalPhoto } from "./professionalAnalyze.js";
import { normalizePurpose } from "../utils/normalizePurpose.js";

/**
 * Analyzer function to score photos based on selected purpose.
 * @param {Map<string, Object>} photoScoresMap 
 * @param {string} rawPurpose 
 * @returns {Array<Object>} Sorted analyzed results
 */
export const Analyzer = (photoScoresMap, rawPurpose) => {
  const purpose = normalizePurpose(rawPurpose);

  switch (purpose) {
    case 'instagram':
      console.log('📷 Analyzing for Instagram...');
      return analyzeInstagram(photoScoresMap);

    case 'linkedin':
      console.log('👔 Analyzing for LinkedIn...');
      return analyzeLinkedin(photoScoresMap);

    case 'datingApps':
      console.log('❤️ Analyzing for Dating Apps...');
      return analyzeDatingApp(photoScoresMap);

    case 'resume':
      console.log('📄 Analyzing for Resume...');
      return analyzeResumePhoto(photoScoresMap);

    case 'facebook':
      console.log('👥 Analyzing for Facebook...');
      return analyzeFacebook(photoScoresMap);

    case 'twitter':
      console.log('🐦 Analyzing for Twitter/X...');
      return analyzeTwitter(photoScoresMap);

    case 'professional':
      console.log('🏢 Analyzing for Professional...');
      return analyzeProfessionalPhoto(photoScoresMap);

    default:
      console.warn(`⚠️ Unknown purpose "${purpose}", falling back to Instagram...`);
      return analyzeInstagram(photoScoresMap);
  }
};
