const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  ticketId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  assetName: { 
    type: String, 
    required: true 
  },
  issue: { 
    type: String, 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved'], 
    default: 'Open' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);