const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Open CORS for all origins (for nginx proxy)
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Serve static uploads before API routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const userRoutes = require('./routes/user.js');
const projectRoutes = require('./routes/project.js');
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

const PORT = 5000;

// Mongoose connect (no deprecated options for v6+)
mongoose.connect('mongodb://mongo:27017/JesaDB')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://0.0.0.0:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });