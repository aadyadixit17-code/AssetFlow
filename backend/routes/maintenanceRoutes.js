const express = require('express');
const router = express.Router();

// Temporary mock routes to prevent any import crashes
router.get('/', (req, res) => {
  res.json([]);
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Maintenance record created' });
});

module.exports = router;