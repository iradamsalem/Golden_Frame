import User from '../models/User.js';

/**
 * Applies decay to existing labels and reinforces new ones.
 *
 * @param {Object} existingLabels - { [label: string]: number }
 * @param {string[]} newLabels - list of labels from current photo
 * @param {number} decayFactor - how much to reduce old labels (e.g., 0.9)
 * @returns {Object} - updated label map
 */
function updateLabelsWithDecay(existingLabels = {}, newLabels = [], decayFactor = 0.9) {
  const updated = {};

  for (const label in existingLabels) {
    const decayed = existingLabels[label] * decayFactor;
    if (decayed > 0.01) {
      updated[label] = decayed;
    }
  }

  newLabels.forEach(label => {
    if (updated[label]) {
      updated[label] += 1;
    } else {
      updated[label] = 1;
    }
  });

  return updated;
}

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
 * Updates user's favorite labels for a given purpose using decay logic.
 */
export const updateFavoriteLabels = async (email, purpose, newLabels) => {
  const decayFactor = 0.9;

  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const existingMap = user.favoriteLabels?.[purpose]; // ❗️object property access
  const existingLabels = existingMap ? Object.fromEntries(existingMap) : {};

  const updatedLabels = updateLabelsWithDecay(existingLabels, newLabels, decayFactor);

  user.favoriteLabels[purpose] = new Map(Object.entries(updatedLabels)); // Save back as Map
  await user.save();

  return user;
};

/**
 * Retrieves favorite label **descriptions only** (no weights), for use in Python similarity.
 */
export const getFavoriteLabelsByPurpose = async (email, purpose) => {
  const user = await User.findOne({ email });
  if (!user) return [];

  const labelsMap = user.favoriteLabels?.[purpose];
  if (!labelsMap) return [];

  return [...labelsMap.keys()]; // ✅ return array of strings (label descriptions only)
};
