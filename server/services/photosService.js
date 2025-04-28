export const processPhotos = async (photos) => {
    console.log('Processing photos...');

    const processedPhotos = photos.map((photo, index) => ({
      originalName: photo.originalname,
      size: photo.size,
      mimeType: photo.mimetype,
      bufferLength: photo.buffer.length,
    }));

    console.log('Processed photos:', processedPhotos); // Debugging line to check processed photos
    
    return processedPhotos;
};
