import User from '../models/User.js';

/**
 * createUser
 * 
 * Creates a new user in the database.
 * 
 * @param {Object} userData - User data to be created
 * @returns {Promise<Object>} New user object
 */
export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

/**
 * findByEmail
 * 
 * Finds a user by email in the database.
 * 
 * @param {string} email - Email to search
 * @returns {Promise<Object|null>} User object or null
 */
export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * updateFavoriteLabels
 * 
 * Updates a user's favorite labels for a specific category (purpose).
 * 
 * @param {string} email - Email of the user
 * @param {string} purpose - Category (e.g. 'linkedin', 'instagram')
 * @param {string[]} labels - Array of labels to save
 * @returns {Promise<Object|null>} Updated user or null if not found
 */
export const updateFavoriteLabels = async (email, purpose, labels) => {
  const fieldPath = `favoriteLabels.${purpose}`;

  const update = {
    $set: {
      [fieldPath]: labels
    }
  };

  return await User.findOneAndUpdate({ email }, update, { new: true });
};
