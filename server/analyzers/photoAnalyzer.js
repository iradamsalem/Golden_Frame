/**
 * Analyzer Function
 *
 * Runs analysis on a given photo scores map according to the selected purpose.
 * Currently only supports analysis for the 'Instagram' use case via `analyzeInstagram`.
 * Designed to be extended in the future for other purposes (e.g., LinkedIn, Dating).
 *
 * @function
 * @param {Map<string, Object>} photoScoresMap - A Map of photo names to their normalized scores and metadata
 * @returns {Array<Object>} An array of analyzed photo objects, sorted by descending score
 */

import { analyzeInstagram} from "./instagramAnalyze.js"
import { savePurpose } from "../services/purpose.service.js";

export const Analyzer = (photoScoresMap) => {
   // switch (savePurpose) {
    //  case 'Instagram':
        console.log('Analyzing for Instagram...');
        const result=analyzeInstagram(photoScoresMap);
        return result;
       // break;
    }

    
  //};
  