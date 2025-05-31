import express from 'express';
import { receivePurpose } from '../controllers/purpose.controller.js';

/**
 * purposeRoutes
 * 
 * Defines the routes for purpose-related operations.
 */

const router = express.Router();

router.post('/', receivePurpose);

export default router;
