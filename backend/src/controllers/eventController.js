const Event = require('../models/Event');

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'ACTIVE' }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Định dạng ID sự kiện không hợp lệ' });
    }
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tải chi tiết sự kiện', error: error.message });
  }
};

const updateEventMetadata = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, location, bannerUrl, startTime, endTime } = req.body;

    const event = await Event.findOne({ blockchainId: id });
    if (!event) return res.status(404).json({ message: "Không tìm thấy sự kiện" });

    if (event.organizerWallet.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
      return res.status(403).json({ message: "Cảnh báo: Bạn không phải chủ sự kiện này!" });
    }

    event.description = description || event.description;
    event.location = location || event.location;
    event.bannerUrl = bannerUrl || event.bannerUrl;
        
    if (startTime) event.startTime = new Date(startTime);
    if (endTime) event.endTime = new Date(endTime);

    await event.save();
    res.status(200).json({ message: "Cập nhật thông tin sự kiện thành công!", event });
  } catch (error) {
    next(error);
  }
};

const getOrganizerDashboard = async (req, res, next) => {
  try {
    const walletAddress = req.user.walletAddress.toLowerCase();
    const events = await Event.find({ organizerWallet: walletAddress }).sort({ createdAt: -1 });
    
    let totalTicketsSold = 0;
    let totalRevenueETH = 0;
    
    const eventStats = events.map(event => {
      const sold = event.currentMinted || 0;
      const price = parseFloat(event.price || 0);
      const revenue = sold * price;
      
      totalTicketsSold += sold;
      totalRevenueETH += revenue;

      return {
        _id: event._id,
        blockchainId: event.blockchainId,
        name: event.name,
        status: event.status,
        maxSupply: event.maxSupply,
        sold,
        revenueETH: revenue.toFixed(4), 
        bannerUrl: event.bannerUrl
      };
    });
    
    res.status(200).json({
      summary: { totalEvents: events.length, totalTicketsSold, totalRevenueETH: totalRevenueETH.toFixed(4) },
      events: eventStats
    });
  } catch (error) {
    next(error);
  }
};

const createOrUpdateEventFromBlockchain = async (req, res, next) => {
  try {
    const { id } = req.params;
    const walletAddress = req.user.walletAddress.toLowerCase();
    
    let event = await Event.findOne({ blockchainId: id });
    
    if (!event) {
      event = new Event({
        blockchainId: id,
        organizerWallet: walletAddress,
        status: 'ACTIVE',
        isOnChain: true
      });
    } else if (event.organizerWallet.toLowerCase() !== walletAddress) {
       return res.status(403).json({ message: "Bạn không có quyền sửa sự kiện này!" });
    }

    const fields = ['name', 'description', 'category', 'location', 'price', 'maxSupply', 'maxResellPercentage'];
    
    fields.forEach(field => {
       if (req.body[field] !== undefined) {
           event[field] = req.body[field];
       }
    });

    if (req.body.startTime) event.startTime = new Date(req.body.startTime);
    if (req.body.endTime) event.endTime = new Date(req.body.endTime);
    if (req.body.bannerUrl) event.bannerUrl = req.body.bannerUrl;

    await event.save();
    res.status(200).json({ message: "Lưu sự kiện thành công!", event });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, getEventById, updateEventMetadata, getOrganizerDashboard, createOrUpdateEventFromBlockchain };