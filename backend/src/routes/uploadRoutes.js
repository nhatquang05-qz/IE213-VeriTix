const express = require('express');
const router = express.Router();
const uploadCloud = require('../config/cloudinary');
const { protect, organizerOnly } = require('../middlewares/authMiddleware');

// Route này cho phép upload ảnh và trả về link URL
router.post('/image', protect, organizerOnly, uploadCloud.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Upload ảnh thất bại' });
  }
  res.json({ imageUrl: req.file.path });
});

module.exports = router;