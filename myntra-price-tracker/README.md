# Myntra Wishlist Price Tracker

## Features

- Auto scans Myntra wishlist every 12 hours
- Detects price changes
- Sends email when price drops
- Manual scan support
- No backend required

---

# Setup

## 1. Create EmailJS Account

Visit:
https://www.emailjs.com

Create:
- Service
- Email Template
- Public Key

---

## 2. Update config.js

Replace:

- YOUR_PUBLIC_KEY
- YOUR_SERVICE_ID
- YOUR_TEMPLATE_ID

---

## 3. Load Extension

Open:
chrome://extensions/

Enable:
Developer Mode

Click:
Load Unpacked

Select:
myntra-price-tracker

---

## 4. Login to Myntra

Open:
https://www.myntra.com

Login normally.

The extension uses your existing session.

---

# EmailJS Template Example

Subject:
Price Dropped on Myntra!

Body:

Product: {{product_name}}

Old Price: ₹{{old_price}}
New Price: ₹{{new_price}}

Product Link:
{{product_url}}

---

# Important Notes

- Myntra DOM structure may change
- Update selectors if scraping breaks
- Browser must remain installed
- Extension works only when logged into Myntra