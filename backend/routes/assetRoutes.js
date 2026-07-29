const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// GET all registered assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST register a new asset unit
router.post('/', async (req, res) => {
  const { name, category, location } = req.body;
  
  if (!name || !location) {
    return res.status(400).json({ message: 'Name and location fields are required.' });
  }

  try {
    // Generate an incremental count suffix identifier
    const totalCount = await Asset.countDocuments();
    const assetId = `AST-00${totalCount + 1}`;

    const newAsset = new Asset({
      assetId,
      name,
      category,
      location,
      status: 'Available'
    });

    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;