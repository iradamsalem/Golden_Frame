import User from '../models/User.js';

/**
 * createUser
 * 
 * Creates a new user in the database.
 * 
 * @async 
 * @function
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
 * @async   
 * @function
 * @param {string} email - User email to search for
 * @returns {Promise<Object>} User object or null if not found
 */
export const findByEmail = async (email) => {
  return await User.findOne({ email });
};
