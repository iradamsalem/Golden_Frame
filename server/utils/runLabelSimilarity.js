import { spawn } from 'child_process';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const runLabelSimilarity = (inputData) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../rag/label_similarity.py');

    const py = spawn('python', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

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
        return reject(new Error(`Python process exited with code ${code}\n${error}`));
      }
      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse Python output as JSON: ${output}`));
      }
    });

    try {
      py.stdin.write(JSON.stringify(inputData));
      py.stdin.end();
    } catch (err) {
      reject(new Error(`Failed to send input to Python: ${err.message}`));
    }
  });
};
