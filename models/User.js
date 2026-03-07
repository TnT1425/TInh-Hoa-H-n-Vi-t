const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  phone: { type: String, default: '' },    
  address: { type: String, default: '' },
  resetOtp: { type: String, default: '' },   
  otpExpires: { type: Date, default: Date.now },
  role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);