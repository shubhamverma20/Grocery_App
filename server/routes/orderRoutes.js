const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// @route POST /api/orders
// @desc  Place a new order (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const { customerName, items, totalAmount, shippingAddress, paymentMethod } = req.body;
        
        const newOrder = new Order({
            user: req.user.id,
            customerName,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        const order = await newOrder.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to place order: ' + err.message });
    }
});

// @route GET /api/orders/my-orders
// @desc  Get logged-in user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// @route GET /api/orders
// @desc  Get all orders (Admin Only)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route GET /api/orders/stats
// @desc  Get sales stats (Admin Only)
router.get('/stats', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const orders = await Order.find();
        
        // Calculate Total Sales
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        // Group by Date for Chart
        const salesByDate = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            salesByDate[date] = (salesByDate[date] || 0) + order.totalAmount;
        });

        // AI Suggestions Logic: Analyze popular items
        const itemSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
            });
        });

        res.json({
            totalSales,
            totalOrders: orders.length,
            salesByDate,
            itemSales
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

module.exports = router;
