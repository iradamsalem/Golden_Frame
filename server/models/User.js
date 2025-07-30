import mongoose from 'mongoose';

/**
 * User Schema
 * 
 * Represents a user in the system.
 */

const weightedLabelMap = {
  type: Map,
  of: Number,
  default: new Map()
};

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
    linkedin:     { ...weightedLabelMap },
    instagram:    { ...weightedLabelMap },
    facebook:     { ...weightedLabelMap },
    twitter:      { ...weightedLabelMap },
    resume:       { ...weightedLabelMap },
    professional: { ...weightedLabelMap },
    datingApps:   { ...weightedLabelMap }
  }
});

const User = mongoose.model('User', userSchema);
export default User;
