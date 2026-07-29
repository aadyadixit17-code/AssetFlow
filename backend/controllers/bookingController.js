const Booking = require('../models/Booking');
const Asset = require('../models/Asset');

// @desc    Create a new shared resource calendar booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { assetId, startTime, endTime, purpose } = req.body;
    const userId = req.user.id; // Pulled straight from token payload

    // Validation: Check if asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Resource asset not found' });
    }

    // Smart Conflict Guard: Check if the resource is already reserved for this timeline
    const conflict = await Booking.findOne({
      assetId,
      status: 'Confirmed',
      $or: [
        { startTime: { $lte: new Date(endTime) }, endTime: { $gte: new Date(startTime) } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: 'Resource conflict: This time slot is already reserved.' });
    }

    const booking = await Booking.create({
      assetId,
      bookedBy: userId,
      startTime,
      endTime,
      purpose
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error processing schedule allocation', error: error.message });
  }
};

// @desc    Get all bookings (with optional filter for active user logs)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('assetId', 'name type status')
      .populate('bookedBy', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error pulling schedules', error: error.message });
  }
};

module.exports = { createBooking, getBookings };