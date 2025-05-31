import { processPhotos } from '../services/photosService.js';

let processedPhotos = [];

export const uploadPhotos = async (req, res) => {
  try {
    console.log('Full req.body:', req.body);

    const { email, purpose } = req.body;

    console.log('Received email:', email);
    console.log('Received purpose:', purpose);
    console.log('Number of files:', req.files.length);

    if (!email || !purpose) {
      return res.status(400).json({ error: 'Missing email or purpose in the request body.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No photos uploaded.' });
    }

    const bestPhotos = await processPhotos(req.files, purpose, email);

    processedPhotos = bestPhotos; 

    res.status(200).json({ message: 'Photos uploaded and processed successfully!' });
  } catch (error) {
    console.error('Error processing photos:', error);
    res.status(500).json({ error: 'Failed to process photos.' });
  }
};

export const getSelectedImage = (req, res) => {
  try {
    if (!processedPhotos || processedPhotos.length === 0) {
      return res.status(404).json({ message: 'No images available.' });
    }

    const photos = processedPhotos.map((photo, index) => ({
      rank: index + 1,
      image: `data:${photo.mimeType};base64,${photo.buffer.toString('base64')}`,
      score: photo.score,
      labels: photo.labels || [],
    }));

    processedPhotos = [];

    res.status(200).json({
      message: 'Photos retrieved successfully!',
      photos,
    });
  } catch (error) {
    console.error('Error retrieving photos:', error);
    res.status(500).json({ message: 'Failed to retrieve photos.' });
  }
};
