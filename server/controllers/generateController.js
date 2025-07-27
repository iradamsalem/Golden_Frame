import { generateWithOpenRouter } from '../services/openRouterService.js';

export const handleGenerate = async (req, res) => {
  const { purpose, prompt, labels } = req.body;

  if (!purpose) {
    return res.status(400).json({ error: 'Purpose is required' });
  }

  try {
    const result = await generateWithOpenRouter(purpose, prompt, labels);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};
