const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  email: { 
    type: String, 
    trim: true,
    lowercase: true,
    sparse: true 
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
  nonce: { 
    type: String, 
    required: true 
  }, 
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);