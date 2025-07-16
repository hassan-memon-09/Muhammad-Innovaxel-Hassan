const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();

const app = express();


app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());


app.use(express.static(path.join(__dirname, '../frontend/build')));


app.use('/api', urlRoutes);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));