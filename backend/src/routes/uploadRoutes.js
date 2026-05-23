const express = require('express');
const router = express.Router();
const uploadCloud = require('../config/cloudinary');
const { protect, organizerOnly } = require('../middlewares/authMiddleware');

router.post('/image', protect, organizerOnly, (req, res) => {
  // Bọc hàm upload của multer để bắt lỗi chi tiết
  const upload = uploadCloud.single('image');

  upload(req, res, function (err) {
    if (err) {
      console.error("❌ LỖI CLOUDINARY/MULTER:", err);
      return res.status(500).json({ 
        message: 'Lỗi cấu hình Cloudinary hoặc file ảnh', 
        error: err.message || "Lỗi không xác định từ Cloudinary" 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Không tìm thấy file ảnh đính kèm (req.file rỗng)' });
    }

    // Nếu thành công, trả về link ảnh
    res.status(200).json({ imageUrl: req.file.path });
  });
});

module.exports = router;