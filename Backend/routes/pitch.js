const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware')

const {
  businessOnly,
  studentOnly,
} = require('../middleware/roleguard.middleware');

const pitchController = require('../Controllers/pitch.controller');

// Submit pitch
router.post(
  '/',
  authMiddleware,
  studentOnly,
  pitchController.createPitch
);

// Improve pitch using AI
router.post(
  '/improve',
  authMiddleware,
  studentOnly,
  pitchController.improvePitch
);

// Get pitches for a task
router.get(
  '/task/:taskId',
  authMiddleware,
  businessOnly,
  pitchController.getTaskPitches
);

// Get student's pitches
router.get(
  '/my',
  authMiddleware,
  studentOnly,
  pitchController.getMyPitches
);

// Get single pitch
router.get(
  '/:id',
  authMiddleware,
  pitchController.getPitchById
);

// Shortlist pitch
router.patch(
  '/:id/shortlist',
  authMiddleware,
  businessOnly,
  pitchController.shortlistPitch
);

// Accept pitch
router.patch(
  '/:id/accept',
  authMiddleware,
  businessOnly,
  pitchController.acceptPitch
);

// Reject pitch
router.patch(
  '/:id/reject',
  authMiddleware,
  businessOnly,
  pitchController.rejectPitch
);

// Release payment
router.patch(
  '/:id/release-payment',
  authMiddleware,
  businessOnly,
  pitchController.releasePayment
);

module.exports = router;