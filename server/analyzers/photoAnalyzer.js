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
  