const express = require('express');
const { getSystemStats, getAdminUsers, getAdminEvents, updateEventStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/stats', protect, adminOnly, getSystemStats);
router.get('/users', protect, adminOnly, getAdminUsers);
router.get('/events', protect, adminOnly, getAdminEvents);
router.put('/events/:id/status', protect, adminOnly, updateEventStatus);

module.exports = router;