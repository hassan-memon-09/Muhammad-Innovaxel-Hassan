const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/url');

exports.createShortUrl = async (req, res) => {
  const { url } = req.body;
  if (!validUrl.isWebUri(url)) return res.status(400).json({ error: 'Invalid URL' });

  try {
    let existing = await Url.findOne({ originalUrl: url });
    if (existing) return res.status(200).json(existing);

    const shortCode = shortid.generate();
    const newUrl = new Url({ originalUrl: url, shortCode });
    await newUrl.save();
    res.status(201).json(newUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).json({ error: 'Short URL not found' });
    url.accessCount++;
    await url.save();
    res.status(200).json(url);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateShortUrl = async (req, res) => {
  const { shortCode } = req.params;
  const { url } = req.body;
  if (!validUrl.isWebUri(url)) return res.status(400).json({ error: 'Invalid URL' });

  try {
    const updated = await Url.findOneAndUpdate(
      { shortCode },
      { originalUrl: url, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Short URL not found' });
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteShortUrl = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const deleted = await Url.findOneAndDelete({ shortCode });
    if (!deleted) return res.status(404).json({ error: 'Short URL not found' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUrlStats = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).json({ error: 'Short URL not found' });
    res.status(200).json(url);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectToOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).json({ error: 'Short URL not found' });
    url.accessCount++;
    await url.save();
    res.redirect(url.originalUrl);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};
