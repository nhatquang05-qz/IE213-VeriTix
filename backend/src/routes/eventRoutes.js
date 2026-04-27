const express = require('express');
const { 
  getEvents, 
  getEventById, 
  getOrganizerDashboard,
  createOrUpdateEventFromBlockchain
} = require('../controllers/eventController');

const { protect, organizerOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/organizer/dashboard', protect, organizerOnly, getOrganizerDashboard);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', protect, organizerOnly, createOrUpdateEventFromBlockchain);

module.exports = router;