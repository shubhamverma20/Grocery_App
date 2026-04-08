// Default Product Catalog
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
        image: "https://placehold.co/400x400/4A1C40/FFFFFF?text=Chocolate",
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
        image: "https://placehold.co/400x400/D4A017/333333?text=Chips",
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
        image: "https://placehold.co/400x400/C8A97A/5C3317?text=Biscuits",
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
        image: "https://placehold.co/400x400/FF8C00/FFFFFF?text=Orange+Juice",
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
        image: "https://placehold.co/400x400/C8102E/FFFFFF?text=Cold+Drink",
        rating: 4.8,
        reviews: 750,
        badge: "High Demand"
    }
];

// Load products from localStorage (Admin can add/remove)
let products = JSON.parse(localStorage.getItem('products'));
if (!products || products.length === 0) {
    products = DEFAULT_PRODUCTS;
    localStorage.setItem('products', JSON.stringify(products));
}
// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || []

// Active Category Filter
let currentCategory = 'All';

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');

// Initialize App
function init() {
    if (productsContainer) renderProducts();
    updateCartUI();

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('SW registered!', reg))
                .catch(err => console.log('SW fail: ', err));
        });
    }
}

// Render Products to DOM
function renderProducts() {
    productsContainer.innerHTML = '';

    const filtered = currentCategory === 'All'
        ? products
        : products.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
        productsContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-secondary);">
            <div style="font-size:64px; margin-bottom:16px;">🔍</div>
            <p style="font-size:18px; font-weight:600;">No products in this category yet.</p>
        </div>`;
        return;
    }

    filtered.forEach((product, index) => {
        const delay = index * 0.07;
        const badgeHTML = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
        const oldPriceHTML = product.originalPrice > product.price ? `<span>₹${product.originalPrice}</span>` : '';

        const productHtml = `
            <div class="product-card fade-in" style="animation-delay: ${delay}s">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.style='font-size:80px;text-align:center;display:block;padding:30px 0'; this.outerHTML='<div style=\'font-size:80px;text-align:center;padding:30px 0\'>${product.emoji || '🛒'}</div>'">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <ion-icon name="star"></ion-icon>
                    ${product.rating} <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">₹${product.price} ${oldPriceHTML}</div>
                    <button class="btn-add" onclick="addToCart(event, ${product.id})" title="Add to Cart">
                        <ion-icon name="add-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHtml;
    });
}

// Category Filter
function filterCategory(category, el) {
    currentCategory = category;
    // Update active state on category pills
    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
    if (el) el.classList.add('active');
    // Update section title
    const title = document.querySelector('.section-title');
    if (title) title.textContent = category === 'All' ? 'Fresh Picks For You' : category;
    if (productsContainer) renderProducts();
}

// Cart Functionality
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
}

function addToCart(event, productId) {
    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback!

    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();

    // Add satisfying pop animation to cart icon
    const cartIcon = document.querySelector('.cart-btn');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);

    // Provide visual feedback
    const btn = event.currentTarget;
    if (btn) {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
        btn.style.backgroundColor = 'var(--primary-color)';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.backgroundColor = 'var(--surface-color)';
            btn.style.color = 'var(--primary-color)';
        }, 1000);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    products = products.filter(p => p.id !== productId);
    saveProducts();
    // Re-render admin table if on admin page
    if (typeof renderAdminProducts === 'function') renderAdminProducts();
    showToast('Product deleted successfully.');
}

function updateCartUI() {
    // Total Items
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.innerText = totalItems;

    // Render Items
    if (!cartItemsContainer) return; // If on a page without cart sidebar

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); margin-top: 50px;">
                <ion-icon name="basket-outline" style="font-size: 64px; opacity: 0.5;"></ion-icon>
                <p style="margin-top: 15px;">Your cart is empty.</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            cartItemsContainer.innerHTML += `
                <div class="cart-item fade-in">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="close-cart" style="font-size: 18px;" onclick="removeFromCart(${item.id})">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            `;
        });
    }

    // Total Price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalPrice) cartTotalPrice.innerText = `₹${total}`;
}

// Run init on load
document.addEventListener('DOMContentLoaded', init);

// Advanced PWA: Custom Install Promotion
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
});

function showInstallPromotion() {
    if (document.getElementById('installBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'installBanner';
    banner.style.cssText = 'position:fixed; bottom:90px; left:20px; right:20px; background:white; padding:15px; border-radius:12px; box-shadow:var(--shadow-lg); z-index:9999; display:flex; justify-content:space-between; align-items:center; border: 2px solid var(--primary-color); animation: fadeIn 0.5s;';
    banner.innerHTML = `
        <div>
            <div style="font-weight:700; color:var(--text-primary)">Install FreshCart</div>
            <div style="font-size:12px; color:var(--text-secondary)">Add to home screen for native experience</div>
        </div>
        <div style="display:flex; align-items:center;">
            <button id="btnInstall" class="btn-primary" style="padding:8px 15px; font-size:14px; margin-right:10px;">Install</button>
            <button id="btnCloseBanner" style="background:none; border:none; font-size:24px; color:var(--text-secondary); cursor:pointer; display:flex;"><ion-icon name="close-outline"></ion-icon></button>
        </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('btnInstall').addEventListener('click', async () => {
        banner.style.display = 'none';
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User install outcome: ${outcome}`);
            deferredPrompt = null;
        }
    });

    document.getElementById('btnCloseBanner').addEventListener('click', () => {
        banner.style.transform = 'translateY(150px)';
        banner.style.transition = 'transform 0.4s';
        setTimeout(() => banner.remove(), 400);
    });
}

// Utility: Toast Notification
function showToast(message, type = 'success') {
    const existing = document.getElementById('appToast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'appToast';
    const bg = type === 'error' ? '#EF4444' : 'var(--primary-color)';
    toast.style.cssText = `position:fixed; top:90px; right:20px; background:${bg}; color:white; padding:14px 20px; border-radius:12px; font-weight:600; font-size:14px; z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,0.15); animation:fadeIn 0.3s; display:flex; align-items:center; gap:10px;`;
    toast.innerHTML = `<ion-icon name="${type === 'error' ? 'close-circle-outline' : 'checkmark-circle-outline'}" style="font-size:20px;"></ion-icon> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 3000);
}
