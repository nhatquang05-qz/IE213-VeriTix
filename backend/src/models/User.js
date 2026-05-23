const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    sparse: true
  },
  username: { 
    type: String, 
    unique: true, 
    sparse: true,
    trim: true
  },
  password: { 
    type: String 
  },
  fullName: { 
    type: String, 
    default: 'Anonymous User' 
  },
  phone: { 
    type: String, 
    trim: true,
    sparse: true
  },
  isOrganizer: { type: Boolean, default: false }, 
  isAdmin: { type: Boolean, default: false },
  isStaff: { type: Boolean, default: false },
  nonce: { 
    type: String
  }, 
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);