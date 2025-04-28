import express from 'express';
import cors from 'cors';

import purposeRoutes from './routes/purpose.routes.js';
import photosRoutes from './routes/photos.routes.js'; 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/purpose', purposeRoutes);
app.use('/api/photos', photosRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
