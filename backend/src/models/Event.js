const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  blockchainId: { type: Number, unique: true, index: true }, 
  organizerWallet: { type: String, required: true, lowercase: true }, 

  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "" },
  location: { type: String, default: "TBD" },
  bannerUrl: { type: String, default: "" },
  
  startTime: { type: Date, required: true },
  endTime: { type: Date },

  price: { type: String, required: true }, 
  maxSupply: { type: Number, required: true },
  currentMinted: { type: Number, default: 0 },
  maxResellPercentage: { type: Number, default: 110 },

  initialCapital: { type: Number, default: 0 }, 

  isOnChain: { type: Boolean, default: false }, 
  status: { type: String, enum: ['DRAFT', 'ACTIVE', 'ENDED', 'CANCELLED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);