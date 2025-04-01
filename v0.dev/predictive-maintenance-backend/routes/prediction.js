// routes/prediction.js
const express = require('express');
const { Prediction } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { rotationalSpeed, toolWear, torque, machineType } = req.body;
    
    // Placeholder for AI model calculation
    const predictionProbability = Math.random();
    const noFailure = 1 - predictionProbability;
    
    let recommendation;
    if (predictionProbability > 0.7) {
      recommendation = 'Immediate maintenance (critical)';
    } else if (predictionProbability > 0.5) {
      recommendation = 'Maintenance';
    } else if (predictionProbability > 0.3) {
      recommendation = 'Initial inspection';
    } else {
      recommendation = 'No action required';
    }

    const prediction = await Prediction.create({
      rotationalSpeed,
      toolWear,
      torque,
      machineType,
      predictionProbability,
      noFailure,
      recommendation,
      UserId: req.user.id,
    });

    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating prediction', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const predictions = await Prediction.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching predictions', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Prediction.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });
    res.json({ message: 'Prediction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prediction', error: error.message });
  }
});

module.exports = router;