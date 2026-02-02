const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, phone, fullName } = req.body;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    let user = await User.findOne({ 
      $or: [{ email: cleanEmail }, { phone: cleanPhone }] 
    });
    
    if (user) {
      return res.status(400).json({ message: 'Email hoặc Số điện thoại đã tồn tại!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      fullName: fullName ? fullName.trim() : '',
      role: 'user'
    });

    await user.save();

    res.status(201).json({ message: 'Đăng ký thành công! Vui lòng đăng nhập.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};


exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = await User.findOne({ 
      $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }] 
    });

    if (!user) {
      return res.status(400).json({ message: 'Tài khoản không tồn tại!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng!' });
    }

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret_key_tam_thoi',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            walletAddress: user.walletAddress
          }
        });
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};