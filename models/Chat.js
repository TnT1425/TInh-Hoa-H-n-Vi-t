const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, 
  userName: { type: String, default: 'Khách hàng' },
  messages: [
    {
      sender: { type: String, enum: ['khach', 'staff', 'bot'] },
      text: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);