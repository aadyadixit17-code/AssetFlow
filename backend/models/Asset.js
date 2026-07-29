const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  assetId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Hardware', 'AV Equipment', 'Furniture'], 
    default: 'Hardware' 
  },
  status: { 
    type: String, 
    enum: ['Available', 'Allocated', 'Maintenance'], 
    default: 'Available' 
  },
  location: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);