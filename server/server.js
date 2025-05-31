import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import purposeRoutes from './routes/purpose.routes.js';
import photosRoutes from './routes/photos.routes.js'; 
import userRoutes from './routes/userRoutes.js';
import favoriteLabelRoutes from './routes/favoriteLabelRoutes.js'; // ✅ חדש

dotenv.config();

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/purpose', purposeRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorite-labels', favoriteLabelRoutes); 

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
