const Ticket = require('../models/Ticket');

const getMyTickets = async (req, res, next) => {
  try {    
    const walletAddress = req.user.walletAddress.toLowerCase();       
    const tickets = await Ticket.find({ ownerWallet: walletAddress })
      .populate('eventId', 'name bannerUrl startTime location')
      .sort({ createdAt: -1 }); 

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyTickets };