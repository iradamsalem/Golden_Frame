import { registerUser, loginUser } from '../services/userService.js';

export const register = async (req, res) => {
  console.log('[register] Request received:', req.body);
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('[register] Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  console.log('[login] Request received:', req.body);
  try {
    const user = await loginUser(req.body);
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('[login] Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};
