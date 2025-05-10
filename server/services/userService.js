import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '../validators/userSchema.js';
import { createUser, findByEmail } from '../storage/userStorage.js';

/**
 * registerUser Service
 * 
 * Registers a new user in the system.
 * 
 * @async
 * @function
 * @param {Object} data - User registration data
 * @returns {Promise<Object>} New user object
 */

  
// Register a new user
export const registerUser = async (data) => {
    // 1. Validate input data using Zod schema
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0].message);
    }
    // 2. Extract validated data
    const { name, email, password } = parsed.data;
  
    // 3. Check if user already exists
    const existingUser = await findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 5. Create new user
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword
    });
    // 6. Return user details       
    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };
  };

// Login a user                                     
  export const loginUser = async (data) => {
    // 1. Validate input data using Zod schema
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0].message);
    }
    // 2. Extract validated data
    const { email, password } = parsed.data;
    // 3. Check if user exists
    const user = await findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    // 4. Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    // 5. Return user details   
    return {
      id: user._id,
      name: user.name,
      email: user.email
      // mabey add a token here later
    };
  };