
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }, 
  region: { type: String, required: true, enum: ['North', 'Central', 'South'] },
  image: { type: String },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, default: 'Khác' },
  sold: { type: Number, default: 0 }
}, { timestamps: true });

// LỆNH TỐI ƯU 1: ĐÁNH INDEX (TEXT SEARCH)
// Dòng này báo cho MongoDB biết: "Hãy lập chỉ mục văn bản cho Tên và Mô tả"
// Trọng số (weights): Ưu tiên tìm thấy kết quả ở 'name' (gấp 5 lần) so với 'description'
productSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 5, description: 1 } }
);

module.exports = mongoose.model('Product', productSchema);