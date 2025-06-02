import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const runLabelSimilarity = (inputData) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../rag/label_similarity.py'); 

    const py = spawn('python', [scriptPath]);
    let output = '';
    let error = '';

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      error += data.toString();
      console.error('🐍 Python stderr:', data.toString()); 

    });

    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python error (code ${code}): ${error}`));
      }
      try {
        resolve(JSON.parse(output));
      } catch (e) {
        reject(new Error(`Invalid JSON from Python: ${output}`));
      }
    });

    py.stdin.write(JSON.stringify(inputData));
    py.stdin.end();
  });
};
