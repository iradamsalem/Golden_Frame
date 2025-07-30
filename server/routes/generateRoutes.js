import express from 'express';
import { handleGenerate } from '../controllers/generateController.js';

const router = express.Router();

router.post('/', handleGenerate);

export default router;
