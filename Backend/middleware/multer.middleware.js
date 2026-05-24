const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp',
      'video/mp4',
      'application/pdf',
    ];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('File type not allowed'));
  },
});

module.exports = upload;