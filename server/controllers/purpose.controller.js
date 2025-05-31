import { savePurpose } from '../services/purpose.service.js';

/**
 * receivePurpose Controller
 * 
 * Receives a purpose from the client and saves it to the database.
 */ 

export async function receivePurpose(req, res) {
  const { purpose } = req.body;

  if (!purpose) {
    return res.status(400).json({ error: 'Purpose is required' });
  }

  try {
    const result = await savePurpose(purpose); 
    res.status(200).json({ message: 'Purpose received successfully', data: result });
  } catch (error) {
    console.error('Error saving purpose:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
