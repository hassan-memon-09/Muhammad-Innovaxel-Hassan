const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();

const app = express();

// Log environment variables (for debugging)
console.log('Environment Variables:', {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
});

// Log routes being mounted
console.log('Mounting routes:');
urlRoutes.stack.forEach((r) => {
  const methods = r.route?.methods ? Object.keys(r.route.methods).join(', ') : 'N/A';
  console.log(`Route: ${r.route?.path || 'N/A'}, Method: ${methods}`);
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Serve React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Routes
app.use('/api', urlRoutes);

// Fallback to React's index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));