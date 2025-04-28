import { processPhotos } from '../services/photosService.js';

export const uploadPhotos = async (req, res) => {
  try {
    console.log('Received photos:', req.files); // Debugging line to check received files
    const result = await processPhotos(req.files); // Process the uploaded photos using the service    

    res.status(200).json({
      message: 'Photos uploaded successfully!',
      processed: result,
    });
  } catch (error) {
    console.error('Error processing photos:', error);
    res.status(500).json({ error: 'Failed to process photos' });
  }
};
