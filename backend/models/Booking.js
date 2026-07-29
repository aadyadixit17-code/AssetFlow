const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  assetName: { 
    type: String, 
    required: true 
  },
  bookedBy: { 
    type: String, 
    required: true,
    default: 'Admin User'
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);