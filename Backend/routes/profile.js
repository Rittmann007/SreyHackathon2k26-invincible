const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = require('../middleware/multer.middleware')
const authMiddleware = require('../middleware/auth.middleware');

const {
  studentOnly,
  businessOnly,
} = require('../middleware/roleguard.middleware');

const profileController = require('../controllers/profile.controller');

// ══════════════════════════════════════════
// SHARED USER ROUTES
// ══════════════════════════════════════════

// Get current user profile
router.get(
  '/me',
  authMiddleware,
  profileController.getMyProfile
);

// Update basic profile
router.patch(
  '/me/basic',
  authMiddleware,
  upload.single('profilePic'),
  profileController.updateBasicProfile
);

// ══════════════════════════════════════════
// STUDENT PROFILE ROUTES
// ══════════════════════════════════════════

// Public student profile
router.get(
  '/student/:userId',
  authMiddleware,
  profileController.getStudentProfile
);

// Update student profile
router.patch(
  '/student',
  authMiddleware,
  studentOnly,
  profileController.updateStudentProfile
);

// ══════════════════════════════════════════
// BUSINESS PROFILE ROUTES
// ══════════════════════════════════════════

// Update business profile
router.patch(
  '/business',
  authMiddleware,
  businessOnly,
  profileController.updateBusinessProfile
);

// ══════════════════════════════════════════
// PORTFOLIO ROUTES
// ══════════════════════════════════════════

// Add portfolio item
router.post(
  '/portfolio',
  authMiddleware,
  studentOnly,
  upload.array('media', 5),
  profileController.createPortfolioItem
);

// Get portfolio items
router.get(
  '/portfolio/:userId',
  authMiddleware,
  profileController.getPortfolioItems
);

// Update portfolio item
router.patch(
  '/portfolio/:itemId',
  authMiddleware,
  studentOnly,
  upload.array('media', 5),
  profileController.updatePortfolioItem
);

// Toggle featured
router.patch(
  '/portfolio/:itemId/feature',
  authMiddleware,
  studentOnly,
  profileController.toggleFeaturePortfolioItem
);

// Delete portfolio item
router.delete(
  '/portfolio/:itemId',
  authMiddleware,
  studentOnly,
  profileController.deletePortfolioItem
);

module.exports = router;