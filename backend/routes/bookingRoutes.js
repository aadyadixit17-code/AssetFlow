const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET all active bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new asset booking reservation
router.post('/', async (req, res) => {
  const { assetName, date, time } = req.body;

  if (!assetName || !date || !time) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }

  try {
    const totalCount = await Booking.countDocuments();
    const bookingId = `BKG-${100 + totalCount + 1}`;

    const newBooking = new Booking({
      bookingId,
      assetName,
      date,
      time,
      status: 'Pending'
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;