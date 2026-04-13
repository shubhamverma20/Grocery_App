const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// @route GET /api/products
// @desc  Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route POST /api/products
// @desc  Add a new product (Admin Only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        const { id, name, category, price, originalPrice, image, rating, reviews, badge } = req.body;
        
        const newProduct = new Product({
            id, name, category, price, originalPrice, image, rating, reviews, badge
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// @route DELETE /api/products/:id
// @desc  Delete a product (Admin Only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        const product = await Product.findOneAndDelete({ id: req.params.id });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
