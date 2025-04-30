let lastUploadedBuffer = null;
let lastUploadedMime = null;
import { processPhotos } from '../services/photosService.js';


export const uploadPhotos = async (req, res) => {
  try {
    const result = await processPhotos(req.files);

    // Check if the result is an array of processed images
    lastUploadedBuffer = req.files[0].buffer;
    lastUploadedMime = req.files[0].mimetype;

    res.status(200).json({
      message: 'Photos uploaded successfully!',
    });
  } catch (error) {
    console.error('Error processing photos:', error);
    res.status(500).json({ error: 'Failed to process photos' });
  }
};

export const getSelectedImage = (req, res) => {
  try {
    if (!lastUploadedBuffer) {
      return res.status(404).json({ message: 'No image available' });
    }

    const base64Image = `data:${lastUploadedMime};base64,${lastUploadedBuffer.toString('base64')}`;

    res.status(200).json({
      message: 'Selected image retrieved successfully!',
      image: base64Image,
    });
  } catch (error) {
    console.error('Error retrieving selected image:', error);
    res.status(500).json({ message: 'Failed to retrieve selected image.' });
  }
};
