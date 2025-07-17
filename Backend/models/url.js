const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true, trim: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  accessCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Url', urlSchema);
