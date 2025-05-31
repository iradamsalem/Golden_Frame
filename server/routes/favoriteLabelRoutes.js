// routes/favoriteLabelRoutes.js

import express from 'express';
import { updateFavoriteLabelsController } from '../controllers/favoriteLabelController.js';

const router = express.Router();

/**
 * @route   POST /api/favorite-labels
 * @desc    Save user's favorite labels for a given purpose
 * @access  Public or Authenticated (based on your auth setup)
 */
router.post('/', updateFavoriteLabelsController); // ✅ תוקן - מסלול ריק כי '/api/favorite-labels' כבר קיים בבסיס

export default router;
