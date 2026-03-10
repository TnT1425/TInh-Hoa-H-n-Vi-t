const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }, 
  region: { type: String, required: true, enum: ['North', 'Central', 'South'] }, // Miền Bắc/Trung/Nam
  image: { type: String }, // Link ảnh
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, default: 'Khác' },
  sold: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);