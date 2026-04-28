const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { ethers } = require('ethers');

const getMyTickets = async (req, res, next) => {
  try {    
    const walletAddress = req.user.walletAddress?.toLowerCase();       
    const tickets = await Ticket.find({ ownerWallet: walletAddress })
      .populate('eventId', 'name bannerUrl startTime location')
      .sort({ createdAt: -1 }); 

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { eventId, transactionHash, price, blockchainTicketIds } = req.body;
    const ownerWallet = req.user.walletAddress?.toLowerCase();

    const ticketData = blockchainTicketIds.map(tid => ({
      blockchainTicketId: tid,
      eventId,
      ownerWallet,
      purchasePrice: price,
      status: 'SOLD'
    }));

    const newTickets = await Ticket.insertMany(ticketData);

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId, 
      { $inc: { currentMinted: blockchainTicketIds.length } },
      { new: true }
    );

    if (transactionHash) {
      const totalAmount = (Number(price) * blockchainTicketIds.length).toString();
      await Transaction.create({
        txHash: transactionHash,
        type: 'MINT',
        fromWallet: ownerWallet,
        toWallet: updatedEvent.organizerWallet?.toLowerCase(),
        amount: totalAmount
      });
    }

    res.status(201).json({
      success: true,
      message: `Đã lưu thành công ${blockchainTicketIds.length} vé`,
      data: newTickets
    });
  } catch (error) {
    next(error);
  }
};

const checkInTicket = async (req, res, next) => {
  try {
    const { blockchainTicketId, timestamp, signature } = req.body;
    
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - timestamp > 300) {
      return res.status(400).json({ message: "Mã QR đã hết hạn (quá 5 phút)!" });    
    }
    
    const ticket = await Ticket.findOne({ blockchainTicketId }).populate('eventId');
    if (!ticket) {
      return res.status(404).json({ message: "Vé không tồn tại!" });    
    }
    
    const userId = req.user._id || req.user.id;
    const isOrganizer = ticket.eventId.organizerWallet?.toLowerCase() === req.user.walletAddress?.toLowerCase();
    
    let isStaff = false;
    if (ticket.eventId.staffs && ticket.eventId.staffs.length > 0) {
       isStaff = ticket.eventId.staffs.some(staff => staff.user.toString() === userId.toString());
    }

    if (!isOrganizer && !isStaff && !req.user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền soát vé cho sự kiện này!" });
    }
    
    if (ticket.status === 'USED') {
      return res.status(400).json({ message: "VÉ ĐÃ ĐƯỢC SỬ DỤNG!" });
    }

    const d = new Date(ticket.eventId.startTime);
    const pad = (n) => n.toString().padStart(2, '0');
    const eventTime = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} ${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} UTC`;
    
    const message = `VERITIX CHECK-IN\nSự kiện: ${ticket.eventId.name}\nThời gian: ${eventTime}\nID Vé: #${blockchainTicketId}\nTimestamp: ${timestamp}`;    
    
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== ticket.ownerWallet?.toLowerCase()) {
      return res.status(400).json({ message: "MÃ QR GIẢ MẠO, KHÔNG PHẢI CHÍNH CHỦ!" });
    }
    
    const ticketOwner = await User.findOne({ walletAddress: ticket.ownerWallet });
    ticket.status = 'USED';
    await ticket.save();

    res.status(200).json({ 
      message: "CHECK-IN THÀNH CÔNG!", 
      event: ticket.eventId.name,
      customer: ticketOwner ? ticketOwner.fullName : "Khách hàng"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getMyTickets, createTicket, checkInTicket };