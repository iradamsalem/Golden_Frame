import express from 'express';
import { receivePurpose } from '../controllers/purpose.controller.js';

const router = express.Router();

router.post('/', receivePurpose);

export default router;
