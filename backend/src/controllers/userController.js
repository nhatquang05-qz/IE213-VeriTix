const User = require('../models/User');

const searchUsers = async (req, res, next) => {
  try {
    console.log("Đang tìm kiếm user với từ khóa:", req.query.q);
    
    const { q, limit = 8 } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, 'i'); 
    
    const users = await User.find({
      $or: [
        { username: regex },
        { fullName: regex },
        { walletAddress: regex }
      ]
    })
    .select('_id username fullName walletAddress')
    .limit(Number(limit));

    const formattedUsers = users.map(u => ({
      _id: u._id,
      username: u.username || 'Chưa cập nhật',
      displayName: u.fullName || 'Người dùng ẩn danh',
      walletAddress: u.walletAddress || ''
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Lỗi searchUsers:", error);
    next(error);
  }
};

module.exports = { searchUsers };