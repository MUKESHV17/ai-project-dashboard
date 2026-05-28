// @desc    Upload file/image attachment
// @route   POST /api/uploads
// @access  Private
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded or file rejected by validation filters');
    }

    // Return the file location URL for client reference
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: req.file.originalname,
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};
