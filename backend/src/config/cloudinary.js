const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'veritix_events', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: (req, file) => file.originalname.split('.')[0] + "_" + Date.now(),
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;