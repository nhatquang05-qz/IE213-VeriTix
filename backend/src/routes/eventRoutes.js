const express = require('express');
const { 
  getEvents, 
  getEventById, 
  updateEventMetadata,
  getMyEvents,
  getOrganizerDashboard,
  createOrUpdateEventFromBlockchain,
  addEventStaff,
  getEventStaffs,
  getEventCheckInStats,
  getEventSummaryChart
} = require('../controllers/eventController');

const { protect, organizerOnly } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/organizer/dashboard', protect, organizerOnly, getOrganizerDashboard);
router.get('/my-events', protect, getMyEvents);

router.post('/:id/staff', protect, addEventStaff);
router.get('/:id/staff', protect, getEventStaffs);
router.get('/:id/checkin-stats', protect, getEventCheckInStats);
router.get('/:id/summary-chart', protect, getEventSummaryChart);

router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', protect, createOrUpdateEventFromBlockchain);

module.exports = router;