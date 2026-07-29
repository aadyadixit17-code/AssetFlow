const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
  orgName: { type: String, required: true, default: 'AssetFlow Global Corp' },
  departments: { type: [String], default: ['Engineering', 'Operations', 'Design', 'Human Resources'] }
}, { timestamps: true });

module.exports = mongoose.model('Org', OrgSchema);