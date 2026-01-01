# Jonesaica Infrastructure Solutions - Railway Deployment Guide

## Project Structure

This project has two services that need to be deployed separately:

### 1. Backend (FastAPI/Python)
- Location: `/backend`
- Port: 8001
- Database: MongoDB (you'll need MongoDB Atlas or Railway's MongoDB plugin)

### 2. Frontend (React)
- Location: `/frontend`
- Port: 3000 (or 80 with nginx)

---

## Railway Deployment Steps

### Step 1: Create a New Project on Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Empty Project"

### Step 2: Add MongoDB Database
1. In your project, click "+ New"
2. Select "Database" → "MongoDB"
3. Railway will provision a MongoDB instance
4. Copy the `MONGO_URL` from the Variables tab

### Step 3: Deploy Backend
1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Set the **Root Directory** to `backend`
4. Add these **Environment Variables**:
   ```
   MONGO_URL=<your-railway-mongodb-url>
   DB_NAME=jonesaica_db
   CORS_ORIGINS=*
   PORT=8001
   ```
5. Railway will auto-detect Python and deploy

### Step 4: Deploy Frontend
1. Click "+ New" → "GitHub Repo" (same repo)
2. Set the **Root Directory** to `frontend`
3. Add these **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-service.railway.app
   ```
4. Railway will build and deploy the React app

### Step 5: Configure Domains
1. For each service, go to Settings → Domains
2. Click "Generate Domain" or add a custom domain
3. Update `REACT_APP_BACKEND_URL` in frontend with the backend's URL

---

## Environment Variables Reference

### Backend (.env)
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=jonesaica_db
CORS_ORIGINS=*
PORT=8001
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

---

## Important Notes

### Snipcart Configuration
After deployment, you must whitelist your production domain in Snipcart:
1. Go to [app.snipcart.com](https://app.snipcart.com)
2. Navigate to Account → Domains
3. Add your Railway frontend domain (e.g., `your-app.railway.app`)
4. Also add any custom domains (e.g., `solar.yasharal`)

### API Routes
All backend API routes are prefixed with `/api`:
- `GET /api/products` - Get all products
- `GET /api/products?category=inverters` - Filter by category
- `POST /api/leads` - Submit lead capture form
- `POST /api/seed-products` - Seed product database

### First Deployment
After deploying, seed the products by calling:
```bash
curl -X POST https://your-backend.railway.app/api/seed-products
```

---

## Troubleshooting

### Backend not starting
- Check the PORT environment variable is set
- Verify MONGO_URL is correct
- Check logs in Railway dashboard

### Frontend can't connect to backend
- Ensure REACT_APP_BACKEND_URL is set correctly
- Backend URL must include `https://`
- Check CORS_ORIGINS in backend

### Snipcart cart not working
- Domain must be whitelisted in Snipcart dashboard
- API key must match between dashboard and code
