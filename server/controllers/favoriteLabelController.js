import { saveUserFavoriteLabels } from '../services/favoriteLabelService.js';

/**
 * Normalize purpose to match MongoDB field names (favoriteLabels keys)
 * Example: 'Twitter/X' → 'twitter', 'Dating Apps' → 'datingApps'
 * @param {string} rawPurpose
 * @returns {string} normalizedPurpose
 */
const normalizePurpose = (rawPurpose) => {
  const cleaned = rawPurpose?.toLowerCase().trim();

  switch (cleaned) {
    case 'linkedin':
      return 'linkedin';
    case 'instagram':
      return 'instagram';
    case 'facebook':
      return 'facebook';
    case 'twitter':
    case 'twitter/x':
      return 'twitter';
    case 'resume':
      return 'resume';
    case 'professional':
    case 'proffesional': // typo fallback
      return 'professional';
    case 'dating apps':
    case 'dating':
      return 'datingApps';
    default:
      return cleaned?.replace(/\s+/g, '') || 'unknown';
  }
};

/**
 * Controller to handle saving user's favorite labels.
 */
export const updateFavoriteLabelsController = async (req, res) => {
  try {
    const { email, purpose, labels } = req.body;

    console.log('\n📧 Email:', email);
    console.log('🏷️ Purpose:', purpose);
    console.log('🔖 Labels:', labels);

    if (!email || !purpose || !Array.isArray(labels)) {
      return res.status(400).json({ error: 'Missing required fields: email, purpose, labels' });
    }

    const normalizedPurpose = normalizePurpose(purpose); // ✅ נרמול

    const updatedUser = await saveUserFavoriteLabels(email, normalizedPurpose, labels);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: `Labels for "${normalizedPurpose}" updated successfully`,
      favoriteLabels: updatedUser.favoriteLabels[normalizedPurpose],
    });

  } catch (err) {
    console.error('❌ Error updating favorite labels:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
