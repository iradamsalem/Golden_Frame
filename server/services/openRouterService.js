import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('Missing OpenRouter API Key. Please set OPENROUTER_API_KEY in your .env file.');
}

export const generateWithOpenRouter = async (purpose, prompt, labels = []) => {
  const formattedLabels = labels.length ? labels.join(', ') : '';

  console.log('🎯 Labels passed to OpenRouter:', labels);

  const systemMessage = `You are a smart assistant that writes short, original, and ${purpose}-specific bios or captions or posts. 
Always generate ONE to three sentences only. Be engaging and personalized.`;

  const personaPrompt = labels.length
    ? `Imagine the person is deeply associated with: ${formattedLabels}. Their content should reflect that identity clearly.`
    : '';

  const basePrompt = prompt || `Write a short ${purpose} bio (max 20 words). Only one sentence.`;

  const userMessage = `${basePrompt} ${personaPrompt}`.trim();

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'qwen/qwen3-coder:free',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
};
