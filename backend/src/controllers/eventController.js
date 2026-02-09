const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
  try {
    
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ blockchainId: req.params.id });
    if (!event) return res.status(404).json({ message: "Không tìm thấy sự kiện" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};