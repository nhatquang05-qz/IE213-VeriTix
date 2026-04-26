const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const crypto = require('crypto');

const generateNonce = () => {
  return crypto.randomBytes(16).toString('hex');
};

const getNonce = async (req, res, next) => {
  try {
    const { walletAddress } = req.params;
    if (!walletAddress) return res.status(400).json({ message: "Thiếu địa chỉ ví" });

    const normalizedAddress = walletAddress.toLowerCase();
    let user = await User.findOne({ walletAddress: normalizedAddress });
    
    if (!user) {
      user = await User.create({
        walletAddress: normalizedAddress,
        nonce: generateNonce()
      });
    } else {
      user = await User.findOneAndUpdate(
        { walletAddress: normalizedAddress },
        { nonce: generateNonce() },
        { new: true }
      );
    }

    res.status(200).json({ nonce: user.nonce });
  } catch (error) {
    console.error("Lỗi trong getNonce:", error);
    next(error); 
  }
};

const verifySignature = async (req, res, next) => {
  try {
    const { walletAddress, signature } = req.body;
    if (!walletAddress || !signature) {
      return res.status(400).json({ message: "Thiếu ví hoặc chữ ký" });
    }

    const normalizedAddress = walletAddress.toLowerCase();
    const user = await User.findOne({ walletAddress: normalizedAddress });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const message = `Chào mừng đến với VeriTix!\n\nKý tin nhắn này để xác nhận bạn là chủ sở hữu ví.\n\nMã bảo mật (Nonce): ${user.nonce}`;

    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      return res.status(401).json({ message: "Chữ ký không hợp lệ, phát hiện giả mạo!" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        walletAddress: user.walletAddress, 
        isOrganizer: user.isOrganizer, 
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );

    await User.updateOne(
      { _id: user._id },
      { nonce: generateNonce() }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        fullName: user.fullName,
        isOrganizer: user.isOrganizer
      }
    });

  } catch (error) {
    console.error("Lỗi trong verifySignature:", error);
    next(error);
  }
};

module.exports = { getNonce, verifySignature };