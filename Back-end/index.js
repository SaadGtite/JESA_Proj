const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://mongo:27017/JesaDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/user.js');
const projectRouter = require('./routes/project.js'); // Ensure this file exists

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRouter); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));