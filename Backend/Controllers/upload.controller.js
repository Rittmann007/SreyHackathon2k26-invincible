const { uploadFile } = require('../services/appwrite');

exports.uploadAttachments = async (req, res) => {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
        message: 'No files provided',
      });
    }

    const attachments = await Promise.all(
      files.map((file) =>
        uploadFile(file.buffer, file.originalname, file.mimetype)
      )
    );

    res.status(201).json({
      message: 'Files uploaded successfully',
      attachments,
    });
  } catch (error) {
    res.status(500).json({
      message: 'File upload failed',
      error: error.message,
    });
  }
};