const express = require('express');
const { getMyTickets, createTicket, checkInTicket } = require('../controllers/ticketController'); 

const { protect, organizerOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/my-tickets', protect, getMyTickets);

router.post('/', protect, createTicket);

router.post('/checkin', protect, organizerOnly, checkInTicket);

module.exports = router;