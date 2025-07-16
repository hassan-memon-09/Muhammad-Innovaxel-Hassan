const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/url');

exports.createShortUrl = async (req, res) => {
  const { url } = req.body;

  if (!validUrl.isWebUri(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    let existingUrl = await Url.findOne({ originalUrl: url });
    if (existingUrl) {
      return res.status(200).json(existingUrl);
    }

    const shortCode = shortid.generate();
    const newUrl = new Url({
      originalUrl: url,
      shortCode,
    });

    await newUrl.save();
    res.status(201).json(newUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    url.accessCount += 1;
    await url.save();

    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateShortUrl = async (req, res) => {
  const { shortCode } = req.params;
  const { url } = req.body;

  if (!validUrl.isWebUri(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const updatedUrl = await Url.findOneAndUpdate(
      { shortCode },
      { originalUrl: url, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.status(200).json(updatedUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteShortUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await Url.findOneAndDelete({ shortCode });
    if (!result) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUrlStats = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectToOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    url.accessCount += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};