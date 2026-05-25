const User = require('../models/User');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

const getSystemStats = async (req, res, next) => {
  try {
    const users = await User.find();
    const events = await Event.find();

    const totalUsers = users.length;
    const totalOrganizers = users.filter(u => u.isOrganizer).length;
    const totalEvents = events.length;
    const activeEvents = events.filter(e => e.status === 'ACTIVE').length;
    
    const totalTicketsSold = events.reduce((sum, e) => sum + (e.currentMinted || 0), 0);
    
    let totalRevenue = 0;
    events.forEach(e => {
        totalRevenue += (parseFloat(e.price || 0) * (e.currentMinted || 0));
    });

    const eventStats = events.map(e => {
        const sold = e.currentMinted || 0;
        const price = parseFloat(e.price || 0);
        const revenue = sold * price;
        return {
            eventId: e._id,
            eventName: e.name,
            ticketsSold: sold,
            revenue: revenue,
            participants: sold, 
            avgTicketPrice: price,
            occupancyRate: e.maxSupply > 0 ? (sold / e.maxSupply) * 100 : 0
        };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    res.status(200).json({
        stats: {
            totalUsers,
            totalOrganizers,
            totalEvents,
            activeEvents,
            totalRevenue,
            totalTicketsSold,
            totalParticipants: totalTicketsSold,
            platformFee: totalRevenue * 0.05 
        },
        eventStats
    });
  } catch (error) {
    next(error);
  }
};

const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().lean();
    
    const formattedUsers = await Promise.all(users.map(async u => {
        const ticketsCount = await Ticket.countDocuments({ ownerWallet: u.walletAddress });
        let role = 'user';
        if (u.isAdmin) role = 'admin';
        else if (u.isOrganizer) role = 'organizer';
        
        return {
            id: u._id,
            name: u.fullName || u.username || 'Chưa cập nhật',
            email: u.username ? `${u.username}@veritix.com` : 'Chưa cập nhật',
            role: role,
            status: 'active', // Model hiện tại chưa có trường status, mặc định active
            joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2026-01-01',
            walletAddress: u.walletAddress || '',
            totalTickets: ticketsCount
        };
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    next(error);
  }
};

const getAdminEvents = async (req, res, next) => {
  try {
    const events = await Event.find().lean();
    
    const wallets = events.map(e => e.organizerWallet);
    const organizers = await User.find({ walletAddress: { $in: wallets } }).lean();
    const orgMap = {};
    organizers.forEach(o => orgMap[o.walletAddress] = o.fullName || o.username || o.walletAddress);

    const formattedEvents = events.map(e => {
        let uiStatus = 'pending';
        if (e.status === 'ACTIVE') uiStatus = 'active';
        if (e.status === 'ENDED') uiStatus = 'ended';
        if (e.status === 'CANCELLED') uiStatus = 'rejected';
        if (e.status === 'DRAFT') uiStatus = 'pending';

        return {
            id: e._id,
            name: e.name,
            organizer: orgMap[e.organizerWallet] || e.organizerWallet,
            status: uiStatus,
            startDate: e.startTime ? new Date(e.startTime).toISOString().split('T')[0] : '',
            endDate: e.endTime ? new Date(e.endTime).toISOString().split('T')[0] : '',
            maxTickets: e.maxSupply || 0,
            soldTickets: e.currentMinted || 0,
            revenue: (e.currentMinted || 0) * parseFloat(e.price || 0),
            capacity: e.maxSupply || 0
        };
    });

    res.status(200).json(formattedEvents);
  } catch(error) {
    next(error);
  }
};

const updateEventStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        
        let dbStatus = 'ACTIVE';
        if (status === 'rejected') dbStatus = 'CANCELLED';
        if (status === 'ended') dbStatus = 'ENDED';
        if (status === 'pending') dbStatus = 'DRAFT';

        const event = await Event.findByIdAndUpdate(id, { status: dbStatus }, { new: true });
        res.status(200).json({ message: "Cập nhật trạng thái sự kiện thành công", event });
    } catch (error) {
        next(error);
    }
};

module.exports = { getSystemStats, getAdminUsers, getAdminEvents, updateEventStatus };