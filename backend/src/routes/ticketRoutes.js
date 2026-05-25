const express = require('express');
const { 
    getMyTickets, createTicket, checkInTicket, 
    getMarketplaceTickets, listTicketForResell, cancelResellTicket, buyResellTicket 
} = require('../controllers/ticketController'); 

const { protect, organizerOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/my-tickets', protect, getMyTickets);
router.post('/', protect, createTicket);
router.post('/checkin', protect, organizerOnly, checkInTicket);
router.get('/marketplace', getMarketplaceTickets);
router.post('/:id/resell', protect, listTicketForResell);
router.post('/:id/cancel-resell', protect, cancelResellTicket);
router.post('/:id/buy', protect, buyResellTicket);

module.exports = router;