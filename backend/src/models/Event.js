const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({  
  
  blockchainId: { 
    type: Number, 
    unique: true,
    index: true 
  },  
  
  organizer: { 
    type: String,  
    required: true,
    lowercase: true 
  },

  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  bannerUrl: { type: String },   
  startTime: { type: Date, required: true },
  endTime: { type: Date },  
  price: { type: String, required: true }, 
  maxSupply: { type: Number, required: true },
  currentMinted: { type: Number, default: 0 },
  
  isOnChain: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);