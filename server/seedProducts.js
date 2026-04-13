require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Fresh Organic Bananas",
        category: "Fruits",
        price: 80,
        originalPrice: 100,
        image: "assets/images/bananas.png",
        rating: 4.8,
        reviews: 120,
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Farm Fresh Tomatoes",
        category: "Vegetables",
        price: 45,
        originalPrice: 60,
        image: "assets/images/tomatoes.png",
        rating: 4.5,
        reviews: 85,
        badge: "Fresh Arrival"
    },
    {
        id: 3,
        name: "Whole Wheat Bread",
        category: "Bakery",
        price: 55,
        originalPrice: 65,
        image: "assets/images/bread.png",
        rating: 4.7,
        reviews: 230,
        badge: null
    },
    {
        id: 4,
        name: "Amul Pure Milk (1L)",
        category: "Dairy & Eggs",
        price: 66,
        originalPrice: 66,
        image: "assets/images/milk.png",
        rating: 4.9,
        reviews: 500,
        badge: "High Demand"
    },
    {
        id: 5,
        name: "Organic Red Apples",
        category: "Fruits",
        price: 220,
        originalPrice: 250,
        image: "assets/images/apples.png",
        rating: 4.6,
        reviews: 156,
        badge: "Offer"
    },
    {
        id: 6,
        name: "Green Spinach Bunch",
        category: "Vegetables",
        price: 25,
        originalPrice: 35,
        image: "assets/images/spinach.png",
        rating: 4.3,
        reviews: 90,
        badge: null
    },
    {
        id: 7,
        name: "Free Range Eggs (6 Pcs)",
        category: "Dairy & Eggs",
        price: 60,
        originalPrice: 75,
        image: "assets/images/eggs.png",
        rating: 4.7,
        reviews: 310,
        badge: "Bestseller"
    },
    {
        id: 8,
        name: "Fresh Coriander Leaves",
        category: "Vegetables",
        price: 15,
        originalPrice: 25,
        image: "assets/images/spinach.png",
        rating: 4.4,
        reviews: 45,
        badge: null
    },
    {
        id: 9,
        name: "Cadbury Dairy Milk",
        category: "Snacks",
        price: 45,
        originalPrice: 50,
        image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=400",
        rating: 4.9,
        reviews: 880,
        badge: "Bestseller"
    },
    {
        id: 10,
        name: "Lays Classic Chips",
        category: "Snacks",
        price: 30,
        originalPrice: 35,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400",
        rating: 4.6,
        reviews: 640,
        badge: "Offer"
    },
    {
        id: 11,
        name: "Britannia Good Day Biscuits",
        category: "Snacks",
        price: 25,
        originalPrice: 30,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400",
        rating: 4.5,
        reviews: 420,
        badge: null
    },
    {
        id: 12,
        name: "Tropicana Orange Juice (1L)",
        category: "Snacks",
        price: 120,
        originalPrice: 140,
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=400",
        rating: 4.7,
        reviews: 310,
        badge: "Fresh"
    },
    {
        id: 13,
        name: "Coca-Cola Cold Drink (600ml)",
        category: "Snacks",
        price: 45,
        originalPrice: 50,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400",
        rating: 4.8,
        reviews: 750,
        badge: "High Demand"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grocery_app', { family: 4 });
        console.log('Connected to DB...');
        
        await Product.deleteMany({});
        await Product.insertMany(DEFAULT_PRODUCTS);
        
        console.log('✅ Seed Data Uploaded Successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Error Seeding Data:', err);
        process.exit(1);
    }
};

seedDB();
