const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      qty: Number,
      price: Number 
    }
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' }, 
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);