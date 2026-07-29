const express = require('express');
const router = express.Router();
const Org = require('../models/Org');

// GET company configuration profile
router.get('/', async (req, res) => {
  try {
    let org = await Org.findOne();
    if (!org) {
      org = await Org.create({}); // Generate fallback if empty
    }
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST save / update corporate metrics profile 
router.post('/', async (req, res) => {
  const { orgName, departments } = req.body;
  try {
    let org = await Org.findOne();
    if (org) {
      org.orgName = orgName || org.orgName;
      org.departments = departments || org.departments;
      await org.save();
    } else {
      org = new Org({ orgName, departments });
      await org.save();
    }
    res.json(org);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;