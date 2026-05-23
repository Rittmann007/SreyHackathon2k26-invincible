const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { register, login, me, logout, verifyEmail } = require('../Controllers/Auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/Validation.middleware');

router.post(
	'/register',
	[
		body('name')
			.trim()
			.exists({ checkFalsy: true })
			.withMessage('Name is required')
			.isLength({ min: 3, max: 30 })
			.withMessage('Name must be 3-30 characters'),
		body('email')
			.trim()
			.exists({ checkFalsy: true })
			.withMessage('Email is required')
			.isEmail()
			.withMessage('Invalid email format')
			.normalizeEmail(),
		body('password')
			.trim()
			.exists({ checkFalsy: true })
			.withMessage('Password is required')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters'),
		body('role')
			.trim()
			.exists({ checkFalsy: true })
			.withMessage('Role is required')
			.isIn(['business', 'student'])
			.withMessage('Role must be business or student'),
		body('businessName')
			.if(body('role').equals('business'))
			.trim()
			.exists({ checkFalsy: true })
			.withMessage('Business name is required')
			.isLength({ max: 150 })
			.withMessage('Business name must be at most 150 characters'),
		body('collegeName')
			.if(body('role').equals('student'))
			.optional({ checkFalsy: true })
			.trim()
			.isLength({ max: 150 })
			.withMessage('College name must be at most 150 characters'),
		body('phone')
			.optional({ checkFalsy: true })
			.trim()
			.matches(/^\d{1,10}$/)
			.withMessage('Phone number must be up to 10 digits'),
		body('location').optional(),
		body('businessType').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
		body('description').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
		body('website').optional({ checkFalsy: true }).trim().isURL({ require_protocol: false }),
	],
	handleValidationErrors,
	register,
);

router.post(
	'/login',
	[
		body('email')
			.trim()
			.exists({ checkFalsy: true })
			.withMessage('Email is required')
			.isEmail()
			.withMessage('Invalid email format')
			.normalizeEmail(),
		body('password')
			.trim()
			.exists({ checkFalsy: true })
			.withMessage('Password is required')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters'),
	],
	handleValidationErrors,
	login,
);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);
router.post("/verify-email",verifyEmail)

module.exports = router;