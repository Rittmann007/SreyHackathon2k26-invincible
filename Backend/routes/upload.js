const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');
const uploadController = require('../Controllers/upload.controller');

router.post(
  '/',
  authMiddleware,
  upload.array('attachments', 10),
  uploadController.uploadAttachments
);

module.exports = router;