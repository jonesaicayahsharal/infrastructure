# Jonesaica Infrastructure Solutions Website

A fully functional e-commerce and service-based website for solar energy and building services in Jamaica.

## 🎨 Color Scheme
- **Royal Blue**: Primary background and accents
- **Gold (#d4af37)**: Call-to-action buttons and highlights
- **Royal Purple**: Secondary accents

## 📁 Project Structure (For Easy Editing)

```
/app/
├── backend/                    # FastAPI Backend
│   ├── server.py              # Main API (products, leads, quotes)
│   └── .env                   # Environment variables
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html         # Snipcart script & meta tags
│   │
│   ├── src/
│   │   ├── App.js             # Main app with routing
│   │   ├── App.css            # Custom styles
│   │   ├── index.css          # Global styles & color variables
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx         # Navigation
│   │   │   ├── Footer.jsx         # Footer with contact info
│   │   │   ├── LeadCaptureModal.jsx # Popup form
│   │   │   ├── ContactForm.jsx    # Contact/Quote forms
│   │   │   ├── ProductCard.jsx    # Product display
│   │   │   └── ServiceCard.jsx    # Service display
│   │   │
│   │   └── pages/
│   │       ├── HomePage.jsx       # Landing page
│   │       ├── ProductsPage.jsx   # Product catalog
│   │       ├── ProductDetailPage.jsx
│   │       ├── ContactPage.jsx
│   │       ├── AboutPage.jsx
│   │       ├── QuotePage.jsx
│   │       └── services/
│   │           ├── SolarServicePage.jsx
│   │           ├── ElectricalServicePage.jsx
│   │           ├── CarpentryServicePage.jsx
│   │           └── PlumbingServicePage.jsx
│   │
│   ├── tailwind.config.js     # ⭐ Color definitions here
│   └── package.json
```

## 🔧 Where to Make Changes

### 1. **Change Colors**
Edit `/app/frontend/tailwind.config.js`:
```javascript
colors: {
    royal: {
        950: "#0a0c1a",  // Darkest background
        900: "#0f1229",
        // ... more shades
    },
    gold: {
        600: "#b8860b",
        500: "#d4af37",  // Main gold
        400: "#e6c453",
    },
}
```

Also edit `/app/frontend/src/index.css` for CSS variables.

### 2. **Change Contact Info**
- **Phone Number**: Search for `842-2916` in:
  - `/app/frontend/src/components/Footer.jsx`
  - `/app/frontend/src/pages/ContactPage.jsx`
  - `/app/frontend/src/pages/services/*.jsx`

### 3. **Change Business Name/Logo**
- Edit `/app/frontend/src/components/Header.jsx`
- Edit `/app/frontend/src/components/Footer.jsx`
- Edit `/app/frontend/src/components/LeadCaptureModal.jsx`

### 4. **Change Products & Prices**
Edit `/app/backend/server.py` in the `seed_products()` function:
```python
products_data = [
    {
        "name": "Product Name",
        "category": "inverters",  # or "batteries" or "panels"
        "description": "Description...",
        "regular_price": 295000,  # JMD
        "sale_price": 244000,
        "image_url": "https://...",
        "specs": {...},
        "features": [...]
    },
    # ... more products
]
```

### 5. **Change Service Descriptions**
Edit files in `/app/frontend/src/pages/services/`:
- `SolarServicePage.jsx`
- `ElectricalServicePage.jsx`
- `CarpentryServicePage.jsx`
- `PlumbingServicePage.jsx`

### 6. **Change Snipcart API Key**
Edit `/app/frontend/public/index.html`:
```html
<div id="snipcart" data-api-key="YOUR_KEY_HERE" ...>
```

### 7. **Change Hero Images**
Edit `/app/frontend/src/pages/HomePage.jsx`:
```javascript
src="https://images.unsplash.com/..."  // Change image URLs
```

## 🚀 GitHub + Netlify Deployment

### Option 1: Download & Push to GitHub
1. Download the project files
2. Create a new GitHub repository
3. Push the frontend folder to GitHub
4. Connect GitHub to Netlify

### Option 2: Direct Netlify Deploy
The frontend is a standard React app that can be deployed to Netlify.

#### Build Settings for Netlify:
- **Base directory**: `frontend`
- **Build command**: `yarn build`
- **Publish directory**: `frontend/build`
- **Environment variable**: `REACT_APP_BACKEND_URL` = your backend URL

### For Backend (MongoDB + FastAPI):
- Deploy to Railway, Render, or any Python hosting
- Set environment variables: `MONGO_URL`, `DB_NAME`

## 📧 Form Submissions

Currently, form submissions are stored in MongoDB:
- **Leads collection**: Contact form and popup submissions
- **Quotes collection**: Quote request submissions

To add email notifications, integrate with SendGrid, Mailgun, or Resend in `server.py`.

## 🛒 Snipcart E-commerce

Snipcart handles:
- Shopping cart
- Checkout process
- Payment processing
- Order management

Your Snipcart API Key: `YmMwNjVkZTctODMwZi00NWM5LTliYTctZWQ0Y2U5MjU1ZmU2NjM5MDIxMDgxNTU3NDk1NTk3`

Configure currency and shipping in your Snipcart dashboard.

## 📱 Contact

**Company**: Jonesaica Infrastructure Solutions  
**Phone**: +1-876-842-2916  
**Location**: Greenwood/Lilliput District, St. James, Jamaica  
**Service Area**: Island-Wide (Primary: Trelawny–St. James)

---

Built with React, FastAPI, MongoDB, TailwindCSS, and Snipcart.
