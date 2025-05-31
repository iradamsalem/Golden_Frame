import { updateFavoriteLabels } from '../storage/userStorage.js';

/**
 * Save labels to a user's favoriteLabels under a specific purpose.
 * 
 * @param {string} email - The user's email
 * @param {string} purpose - The category (e.g., 'linkedin', 'resume')
 * @param {string[]} labels - Labels to save
 * @returns {Promise<Object>} - Updated user
 */
export const saveUserFavoriteLabels = async (email, purpose, labels) => {
  return await updateFavoriteLabels(email, purpose, labels);
};
