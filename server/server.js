import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import photosRoutes from './routes/photos.routes.js'; 
import userRoutes from './routes/userRoutes.js';
import favoriteLabelRoutes from './routes/favoriteLabelRoutes.js';
import generateRoutes from './routes/generateRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());           
app.use(express.json());

app.get('/health', (req, res) => res.send('ok'));

app.use('/api/photos', photosRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorite-labels', favoriteLabelRoutes); 
app.use('/api/generate', generateRoutes); 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err.message));
