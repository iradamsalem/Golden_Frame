let processedPhotos = [];
import { processPhotos } from '../services/photosService.js';

/**
 * uploadPhotos Controller
 * 
 * Handles photo upload requests, processes the uploaded photos through analysis pipeline,
 * and stores the results for later retrieval.
 */ 

export const uploadPhotos = async (req, res) => {
  try {
    const bestPhotos = await processPhotos(req.files);
    processedPhotos = bestPhotos; // Store all processed photos

    res.status(200).json({
      message: 'Photos uploaded successfully!',
    });
  } catch (error) {
    console.error('Error processing photos:', error);
    res.status(500).json({ error: 'Failed to process photos' });
  }
};

/**
 * getSelectedImage Controller
 * 
 * Retrieves the processed and analyzed photos, converts them to base64 format,
 * and returns them ranked by score. Clears the stored photos after sending.
*/
export const getSelectedImage = (req, res) => {
  try {
    if (!processedPhotos || processedPhotos.length === 0) {
      return res.status(404).json({ message: 'No images available' });
    }

    const photos = processedPhotos.map((photo, index) => ({
      rank: index + 1,
      image: `data:${photo.mimeType};base64,${photo.buffer.toString('base64')}`,
      score: photo.score
    }));

    // Clear the processedPhotos array after sending the results
    processedPhotos = [];

    res.status(200).json({
      message: 'Photos retrieved successfully!',
      photos: photos,
    });
  } catch (error) {
    console.error('Error retrieving photos:', error);
    res.status(500).json({ message: 'Failed to retrieve photos.' });
  }
};
