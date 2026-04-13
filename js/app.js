// Dynamic API URL for Local vs Production
const API_URL = window.location.hostname.includes('github.io')
    ? 'https://grocery-app-xika.onrender.com/api' 
    : `http://${window.location.hostname}:5000/api`;

// Product Catalog (Loaded from Backend)
let products = [];

// Load products from Backend
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        products = await response.json();
        products = products.map(p => ({ ...p, image: cleanImageUrl(p) }));
        if (productsContainer) renderProducts();
    } catch (err) {
        console.error('Error fetching products:', err);
        showToast('Failed to load products. Using offline data.', 'error');
        // Fallback to localStorage if offline
        products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.map(p => ({ ...p, image: cleanImageUrl(p) }));
        if (productsContainer) renderProducts();
    }
}

function cleanImageUrl(p) {
    const replacements = {
        "Cadbury Dairy Milk": "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=400",
        "Lays Classic Chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400",
        "Britannia Good Day Biscuits": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400",
        "Tropicana Orange Juice (1L)": "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=400",
        "Coca-Cola Cold Drink (600ml)": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400"
    };

    if (replacements[p.name]) return replacements[p.name];
    
    // If it's a placeholder or missing, return a generic high-quality grocery image
    if (!p.image || p.image.includes('placehold.co')) {
        return `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400`;
    }
    return p.image;
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
    fetchProducts();
    updateCartUI();
    updateNavUI();

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

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            products = products.filter(p => p.id !== productId);
            if (typeof renderAdminProducts === 'function') renderAdminProducts();
            showToast('Product deleted successfully.');
        } else {
            const data = await response.json();
            showToast(data.error || 'Delete failed', 'error');
        }
    } catch (err) {
        showToast('Connection error', 'error');
    }
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

function updateNavUI() {
    const navActions = document.getElementById('navActions');
    if (!navActions) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (token && user) {
        navActions.innerHTML = `
            <a href="orders.html" class="nav-link"><ion-icon name="receipt-outline"></ion-icon> My Orders</a>
            <div class="user-profile" style="display:flex; align-items:center; gap:8px; font-weight:600; color:var(--primary-color);">
                <ion-icon name="person-circle-outline" style="font-size:24px;"></ion-icon> Hi, ${user.username.split(' ')[0]}
            </div>
            <button onclick="logout()" class="nav-link" style="border:none; background:none; cursor:pointer; color: #EF4444;">Logout</button>
            <button class="cart-btn" onclick="toggleCart()">
                <ion-icon name="cart-outline"></ion-icon>
                <span class="cart-badge" id="cartCount">${cart.reduce((s,i)=>s+i.quantity,0)}</span>
            </button>
        `;
    } else {
        navActions.innerHTML = `
            <a href="delivery.html" class="nav-link"><ion-icon name="location-outline"></ion-icon> Track Order</a>
            <a href="login.html" class="nav-link">Log In</a>
            <a href="signup.html" class="btn-primary">Sign Up</a>
            <button class="cart-btn" onclick="toggleCart()">
                <ion-icon name="cart-outline"></ion-icon>
                <span class="cart-badge" id="cartCount">${cart.reduce((s,i)=>s+i.quantity,0)}</span>
            </button>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully');
    setTimeout(() => window.location.href = 'index.html', 1000);
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
            <div style="font-weight:700; color:var(--text-primary)">Install FreshKart</div>
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
