const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    badge: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
