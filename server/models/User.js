import mongoose from 'mongoose';

/**
 * User Schema
 * 
 * Represents a user in the system.
 *   
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  favoriteLabels: {
    linkedin:     { type: [String], default: [] },
    instagram:    { type: [String], default: [] },
    facebook:     { type: [String], default: [] },
    twitter:      { type: [String], default: [] },
    resume:       { type: [String], default: [] },
    professional: { type: [String], default: [] },
    datingApps:   { type: [String], default: [] }
  }
});


const User = mongoose.model('User', userSchema);
export default User;
