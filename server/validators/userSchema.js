import {z} from 'zod';

/**
 * userSchema 
 * 
 * Defines the schemas for user registration and login.
 * 
 * @module userSchema
 */
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Validates the user login data
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
