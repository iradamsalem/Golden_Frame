// Import required libraries
const express = require('express'); // Express for creating the HTTP server.
const cors = require('cors'); // CORS to allow cross-origin requests.
const multer = require('multer'); // Multer for handling file uploads.
const sharp = require('sharp'); // Sharp for image processing.

const app = express(); // Create an Express application.
app.use(cors()); // Enable CORS to allow requests from different origins.

const upload = multer(); // Initialize Multer for handling file uploads.

// Root endpoint (GET) - Default route
app.get('/', (req, res) => {
  res.send("Welcome! Use /compare-images to upload two images."); // Inform the user about the API usage.
});

// Endpoint to compare images (POST)
app.post('/compare-images', upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
  // Extract uploaded images from the request
  const image1 = req.files['image1']?.[0]; // First image.
  const image2 = req.files['image2']?.[0]; // Second image.

  // Check if both images are provided
  if (!image1 || !image2) {
    return res.status(400).json({ error: "Both images are required (image1 and image2)" }); // Return error if any image is missing.
  }

  try {
    // Extract metadata of the images using Sharp
    const img1Meta = await sharp(image1.buffer).metadata(); // Metadata of the first image.
    const img2Meta = await sharp(image2.buffer).metadata(); // Metadata of the second image.

    // Calculate the total number of pixels in each image
    const res1 = img1Meta.width * img1Meta.height; // Pixels in the first image.
    const res2 = img2Meta.width * img2Meta.height; // Pixels in the second image.

    // Create a result object with image details
    const result = {
      image1_resolution: {
        width: img1Meta.width, // Width of the first image.
        height: img1Meta.height, // Height of the first image.
        total_pixels: res1 // Total pixels in the first image.
      },
      image2_resolution: {
        width: img2Meta.width, // Width of the second image.
        height: img2Meta.height, // Height of the second image.
        total_pixels: res2 // Total pixels in the second image.
      },
      higher_resolution: res1 > res2 ? "image1" : res2 > res1 ? "image2" : "equal" // Determine which image has higher resolution.
    };

    res.json(result); // Return the result as JSON.

  } catch (err) {
    // Handle errors during image processing
    res.status(500).json({ error: "Internal Server Error", details: err.message }); // Return error to the client.
  }
});

// Define the port and start the server
const PORT = 5000; // Port number for the server.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`); // Log a message when the server starts.
});