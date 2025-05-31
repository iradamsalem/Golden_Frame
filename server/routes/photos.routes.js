import express from 'express';
import { uploadPhotos, getSelectedImage } from '../controllers/photosController.js';
import multer from 'multer';

const router = express.Router();

const upload = multer().any(); 

router.post('/', upload, uploadPhotos);
router.get('/selected-image', getSelectedImage);

export default router;
