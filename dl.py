import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

images = [
    ("hero.png", "https://loremflickr.com/1200/400/grocery,market"),
    ("bananas.jpg", "https://loremflickr.com/400/400/banana"),
    ("tomatoes.jpg", "https://loremflickr.com/400/400/tomato"),
    ("bread.jpg", "https://loremflickr.com/400/400/bread"),
    ("milk.jpg", "https://loremflickr.com/400/400/milk"),
    ("apples.jpg", "https://loremflickr.com/400/400/apple"),
    ("spinach.jpg", "https://loremflickr.com/400/400/spinach"),
    ("eggs.jpg", "https://loremflickr.com/400/400/egg"),
    ("coriander.jpg", "https://loremflickr.com/400/400/coriander")
]

req_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

os.makedirs('assets/images', exist_ok=True)

for name, url in images:
    req = urllib.request.Request(url, headers=req_headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response, open(f'assets/images/{name}', 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Downloaded {name} - Size: {len(data)} bytes")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
