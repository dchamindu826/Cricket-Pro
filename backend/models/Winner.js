const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  prize: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'published'], 
    default: 'pending' // Live comments වලින් එද්දි කෙලින්ම pending වෙනවා
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Winner', winnerSchema);