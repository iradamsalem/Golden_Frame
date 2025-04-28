import express from 'express';
import { uploadPhotos } from '../controllers/photosController.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Route to handle photo uploads
router.post('/', upload.array('photos'), uploadPhotos);

export default router;
