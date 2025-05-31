import { analyzeInstagram } from "./instagramAnalyze.js";
import { analyzeLinkedin } from "./linkedinAnalyze.js";
import { analyzeDatingApp } from "./datingAppsAnalyzer.js"
import { analyzeResumePhoto } from "./resumeAnalyze.js";
import { analyzeFacebook } from "./facebookAnalyze.js";
import { analyzeTwitter } from "./twitterAnlayze.js";
import { analyzeProfessionalPhoto } from "./professionalAnalyze.js";
import { getSavedPurpose } from "../services/purpose.service.js";

/**
 * Analyzer function to score photos based on selected purpose.
 * @param {Map<string, Object>} photoScoresMap 
 * @returns {Array<Object>} Sorted analyzed results
 */
export const Analyzer = (photoScoresMap) => {
  const purposeRaw = getSavedPurpose();
  const purpose = (typeof purposeRaw === 'string' ? purposeRaw : '').toLowerCase().trim();

  let normalizedPurpose = purpose;
  if (normalizedPurpose === 'twitter/x') normalizedPurpose = 'twitter';
  if (normalizedPurpose === 'dating apps') normalizedPurpose = 'dating';
  if (normalizedPurpose === 'proffesional') normalizedPurpose = 'professional'; // typo fallback

  switch (normalizedPurpose) {
    case 'instagram':
      console.log('📷 Analyzing for Instagram...');
      return analyzeInstagram(photoScoresMap);

    case 'linkedin':
      console.log('👔 Analyzing for LinkedIn...');
      return analyzeLinkedin(photoScoresMap);

    case 'dating':
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
