const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  
  tokenId: { 
    type: Number, 
    required: true, 
    index: true 
  },
  
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  
  ownerWallet: { 
    type: String, 
    required: true, 
    lowercase: true 
  },

  
  tokenURI: { type: String, required: true }, 
  
  status: { 
    type: String, 
    enum: ['active', 'listed', 'used'], 
    default: 'active' 
  },

  pricePaid: { type: Number },   
  purchasedAt: { type: Date, default: Date.now }
});


ticketSchema.index({ tokenId: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);