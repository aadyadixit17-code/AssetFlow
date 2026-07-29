const Asset = require('../models/Asset');

// @desc    Register a new corporate asset
// @route   POST /api/assets
// @access  Private (Admin/Manager)
const createAsset = async (req, res) => {
  try {
    const { name, type, serialNumber, status } = req.body;

    const assetExists = await Asset.findOne({ serialNumber });
    if (assetExists) {
      return res.status(400).json({ message: 'Asset with this serial number already exists' });
    }

    const asset = await Asset.create({
      name,
      type,
      serialNumber,
      status,
      history: [{ action: 'Asset Created', performedBy: req.user?.name || 'Admin' }]
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating asset', error: error.message });
  }
};

// @desc    Get all assets with optional filtering
// @route   GET /api/assets
// @access  Private
const getAssets = async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const assets = await Asset.find(query).populate('assignedTo', 'name email');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching assets', error: error.message });
  }
};

// @desc    Update asset details or trigger maintenance status
// @route   PUT /api/assets/:id
// @access  Private
const updateAsset = async (req, res) => {
  try {
    const { name, status, assignedTo } = req.body;
    const asset = await Asset.findById(req.id || req.params.id);

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    asset.name = name || asset.name;
    asset.status = status || asset.status;
    asset.assignedTo = assignedTo !== undefined ? assignedTo : asset.assignedTo;

    if (status && status !== asset.status) {
      asset.history.push({
        action: `Status changed to ${status}`,
        performedBy: req.user?.name || 'System Update'
      });
    }

    const updatedAsset = await asset.save();
    res.json(updatedAsset);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating asset', error: error.message });
  }
};

module.exports = { createAsset, getAssets, updateAsset };