import express from 'express';
import { uploadPhotos, getSelectedImage } from '../controllers/photosController.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/', upload.array('photos'), uploadPhotos);
router.get('/selected-image', getSelectedImage); // GET for selected image
export default router;
