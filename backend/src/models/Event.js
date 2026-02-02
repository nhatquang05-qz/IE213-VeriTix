const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  
  contractEventId: { 
    type: Number, 
    unique: true,
    index: true 
  },
  
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  bannerUrl: { type: String },   
  startTime: { type: Date, required: true },
  endTime: { type: Date },  
  price: { type: Number, required: true }, 
  maxSupply: { type: Number, required: true },
  currentMinted: { type: Number, default: 0 },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);