import os

files = ['index.html', 'login.html', 'cart.html', 'delivery.html', 'admin.html']

head_injection = """
    <!-- PWA Settings -->
    <meta name="theme-color" content="#10B981">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="assets/images/icon-192.png">
</head>"""

def get_bottom_nav(active_page):
    def current(page):
        return ' active' if active_page == page else ''
    
    return f"""
    <!-- Mobile Bottom Navigation (PWA UX) -->
    <div class="mobile-bottom-nav">
        <a href="index.html" class="nav-item{current('index.html')}">
            <ion-icon name="home-outline" class="nav-icon"></ion-icon>
            Home
        </a>
        <a href="cart.html" class="nav-item{current('cart.html')}">
            <ion-icon name="cart-outline" class="nav-icon"></ion-icon>
            Cart
        </a>
        <a href="delivery.html" class="nav-item{current('delivery.html')}">
            <ion-icon name="cube-outline" class="nav-icon"></ion-icon>
            Track
        </a>
        <a href="login.html" class="nav-item{current('login.html')}">
            <ion-icon name="person-outline" class="nav-icon"></ion-icon>
            Profile
        </a>
    </div>
"""

for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Inject HEAD
    if '<link rel="manifest"' not in content:
        content = content.replace('</head>', head_injection)
    
    # Inject BODY
    if 'mobile-bottom-nav' not in content:
        # Find the last <script src="js/app.js"></script> or </body>
        nav_html = get_bottom_nav(file)
        if '<script src="js/app.js"></script>' in content:
            content = content.replace('<script src="js/app.js"></script>', nav_html + '\n    <script src="js/app.js"></script>')
        else:
            content = content.replace('</body>', nav_html + '\n</body>')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done injecting PWA code.")
