import User from '../models/User.js';

/**
 * Creates a new user in the database.
 */
export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

/**
 * Finds a user by email.
 */
export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Updates user's favorite labels for a given purpose.
 */
export const updateFavoriteLabels = async (email, purpose, labels) => {
  const fieldPath = `favoriteLabels.${purpose}`;
  const update = {
    $addToSet: {
      [fieldPath]: { $each: labels }
    }
  };

  return await User.findOneAndUpdate({ email }, update, { new: true });
};

/**
 * Retrieves favorite labels for a specific purpose.
 */
export const getFavoriteLabelsByPurpose = async (email, purpose) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const labels = user.favoriteLabels?.[purpose];
  return labels?.length ? labels : null;
};


