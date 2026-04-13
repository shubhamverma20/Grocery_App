const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional if we allow guest checkout for now
    },
    customerName: {
        type: String,
        required: true
    },
    items: [{
        id: Number,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        firstName: String,
        lastName: String,
        address: String,
        phone: String,
        pinCode: String
    },
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'cod'],
        default: 'upi'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
