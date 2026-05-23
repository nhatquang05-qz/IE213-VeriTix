const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
require('../config/cloudinary');
const cloudinary = require('cloudinary').v2;

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

const getMyEvents = async (req, res, next) => {
  try {
    const userWallet = req.user.walletAddress?.toLowerCase();
    const userId = req.user._id || req.user.id;

    const events = await Event.find({
      $or: [
        { organizerWallet: userWallet },
        { "staffs.user": userId }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(events);
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
        sold: sold,
        currentMinted: sold,
        revenueETH: revenue.toFixed(4), 
        bannerUrl: event.bannerUrl,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        category: event.category,
        price: event.price
      };
    });
    
    res.status(200).json({ summary: { totalEvents: events.length, totalTicketsSold, totalRevenueETH: totalRevenueETH.toFixed(4) }, events: eventStats });
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
      event = new Event({ blockchainId: id, organizerWallet: walletAddress, status: 'ACTIVE', isOnChain: true });
    } else if (event.organizerWallet.toLowerCase() !== walletAddress) {
       return res.status(403).json({ message: "Bạn không có quyền sửa sự kiện này!" });
    }

    const fields = ['name', 'description', 'category', 'location', 'price', 'maxSupply', 'maxResellPercentage'];
    fields.forEach(field => { if (req.body[field] !== undefined) event[field] = req.body[field]; });

    if (req.body.startTime) event.startTime = new Date(req.body.startTime);
    if (req.body.endTime) event.endTime = new Date(req.body.endTime);

    if (req.body.bannerUrl && req.body.bannerUrl.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(req.body.bannerUrl, { folder: 'veritix_events' });
      event.bannerUrl = uploadResponse.secure_url;
    } else if (req.body.bannerUrl) {
      event.bannerUrl = req.body.bannerUrl;
    }
    
    await event.save();
    res.status(200).json({ message: "Lưu sự kiện thành công!", event });
  } catch (error) {
    next(error);
  }
};

const addEventStaff = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { userId, role } = req.body;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Không tìm thấy sự kiện" });

    if (event.organizerWallet?.toLowerCase() !== req.user.walletAddress?.toLowerCase()) {
      return res.status(403).json({ message: "Chỉ Ban tổ chức mới được thêm nhân viên!" });
    }

    const isExist = event.staffs.some(s => s.user.toString() === userId.toString());
    if (isExist) return res.status(400).json({ message: "Người dùng này đã là nhân viên của sự kiện!" });

    event.staffs.push({ user: userId, role });
    await event.save();
    res.status(200).json({ message: "Đã thêm nhân viên thành công!" });
  } catch (error) {
    next(error);
  }
};

const getEventStaffs = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('staffs.user', 'username fullName walletAddress');
    if (!event) return res.status(404).json({ message: "Không tìm thấy sự kiện" });
    res.status(200).json(event.staffs);
  } catch (error) {
    next(error);
  }
};

const getEventCheckInStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const checkedInCount = await Ticket.countDocuments({ eventId: id, status: 'USED' });
    res.status(200).json({ checkedIn: checkedInCount, insideNow: checkedInCount, leftVenue: 0 });
  } catch (error) {
    next(error);
  }
};

const getEventSummaryChart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { timeframe } = req.query;
    
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Không tìm thấy sự kiện' });

    const userId = req.user._id || req.user.id;
    const isOrganizer = event.organizerWallet?.toLowerCase() === req.user.walletAddress?.toLowerCase();
    
    let isStaff = false;
    if (event.staffs && event.staffs.length > 0) {
       isStaff = event.staffs.some(staff => staff.user.toString() === userId.toString());
    }

    if (!isOrganizer && !isStaff && !req.user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền xem thống kê sự kiện này!" });
    }

    const tickets = await Ticket.find({ eventId: id });

    let chartData = [];
    const now = new Date();

    if (timeframe === '24h') {
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        chartData.push({
          label: `${d.getHours().toString().padStart(2, '0')}:00`,
          revenue: 0,
          tickets: 0,
          hour: d.getHours(),
          date: d.getDate()
        });
      }

      tickets.forEach(t => {
        const tDate = new Date(t.createdAt);
        if (now.getTime() - tDate.getTime() <= 24 * 60 * 60 * 1000) {
          const point = chartData.find(p => p.hour === tDate.getHours() && p.date === tDate.getDate());
          if (point) {
            point.tickets += 1;
            point.revenue += parseFloat(t.purchasePrice || 0);
          }
        }
      });
    } else {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        chartData.push({
          label: `${d.getDate()}/${d.getMonth() + 1}`,
          revenue: 0,
          tickets: 0,
          date: d.getDate(),
          month: d.getMonth() + 1
        });
      }

      tickets.forEach(t => {
        const tDate = new Date(t.createdAt);
        if (now.getTime() - tDate.getTime() <= 30 * 24 * 60 * 60 * 1000 + 24*60*60*1000) {
          const point = chartData.find(p => p.date === tDate.getDate() && p.month === (tDate.getMonth() + 1));
          if (point) {
            point.tickets += 1;
            point.revenue += parseFloat(t.purchasePrice || 0);
          }
        }
      });
    }

    res.status(200).json(chartData);
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getEvents, getEventById, updateEventMetadata, getMyEvents, getOrganizerDashboard, 
  createOrUpdateEventFromBlockchain, addEventStaff, getEventStaffs, getEventCheckInStats, getEventSummaryChart 
};