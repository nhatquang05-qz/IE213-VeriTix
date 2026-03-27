const express = require('express');
const { getMyTickets } = require('../controllers/ticketController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/my-tickets', protect, getMyTickets);

module.exports = router;