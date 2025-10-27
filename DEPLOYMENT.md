# 🚀 Deployment Guide - HVAC Estimate App

This guide will deploy your app to:
- **Frontend**: Vercel (free, fast CDN)
- **Backend**: Render (free tier with persistent hosting)

Total time: ~15 minutes

---

## 📋 Step 1: Push to GitHub (5 minutes)

### 1.1 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `hvac-estimate-app`
3. Description: "Full-stack HVAC service estimate generator with PDF/Excel export"
4. Choose **Public** (so hiring managers can see the code)
5. **Don't** initialize with README (we already have one)
6. Click **Create repository**

### 1.2 Push Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: HVAC Estimate App ready for deployment"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hvac-estimate-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## 🖥️ Step 2: Deploy Backend to Render (5 minutes)

### 2.1 Sign Up for Render

1. Go to https://render.com
2. Click **Get Started**
3. Sign up with GitHub (recommended)

### 2.2 Create Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub account and select `hvac-estimate-app` repository
3. Configure the service:

**Basic Settings:**
- **Name**: `hvac-estimate-backend`
- **Region**: Choose closest to you (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- **Free** (select the free tier)

4. Click **Advanced** and add environment variables:
   - `NODE_ENV` = `production`

5. Click **Create Web Service**

### 2.3 Wait for Deployment

- Render will build and deploy (takes 2-3 minutes)
- Watch the logs in the dashboard
- Once you see "✅ Build successful" and "Live", copy your backend URL
- It will look like: `https://hvac-estimate-backend.onrender.com`

✅ Backend is live!

---

## 🌐 Step 3: Update Frontend Config (2 minutes)

Update the API URL in your frontend to point to the deployed backend:

```bash
# Open this file in your editor
# client/src/services/api.service.ts
```

Replace the API_BASE_URL with your Render URL:

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hvac-estimate-backend.onrender.com'  // ← Your actual Render URL
  : 'http://localhost:3000';
```

Commit and push this change:

```bash
git add client/src/services/api.service.ts
git commit -m "Update API URL for production"
git push
```

---

## 🎨 Step 4: Deploy Frontend to Vercel (3 minutes)

### 4.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 4.2 Deploy Frontend

```bash
# Navigate to client folder
cd client

# Login to Vercel (opens browser)
vercel login

# Deploy to production
vercel --prod
```

### 4.3 Answer the Prompts

```
? Set up and deploy "~/hvac-estimate-test/client"? Yes
? Which scope? [Your account name]
? Link to existing project? No
? What's your project's name? hvac-estimate-app
? In which directory is your code located? ./
? Want to override the settings? No
```

### 4.4 Get Your URL

- Vercel will deploy and give you a URL
- It looks like: `https://hvac-estimate-app.vercel.app`
- Copy this URL!

✅ Frontend is live!

---

## 🔐 Step 5: Update Backend CORS (2 minutes)

Now update your backend to allow requests from your Vercel frontend:

```bash
# Navigate back to project root
cd ..

# Open server/src/index.ts
```

Find the CORS configuration and update it:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'https://hvac-estimate-app.vercel.app',  // ← Your actual Vercel URL
];
```

Commit and push:

```bash
git add server/src/index.ts
git commit -m "Update CORS for production frontend"
git push
```

Render will automatically redeploy your backend (takes 1-2 minutes).

---

## ✅ Step 6: Test Your Deployment

### 6.1 Test Backend

Open in browser: `https://hvac-estimate-backend.onrender.com/api/health`

Should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "production",
  "timestamp": "2025-10-27T...",
  "stats": {...}
}
```

### 6.2 Test Frontend

1. Open: `https://hvac-estimate-app.vercel.app`
2. Fill out the form with test data
3. Click "Download PDF"
4. Should download a PDF ✅

### 6.3 Test Database Persistence

1. Fill out and download another estimate
2. Check backend: `https://hvac-estimate-backend.onrender.com/api/estimates`
3. Should see your saved estimates ✅

---

## 📝 Step 7: Update README with Live Links

Update your README.md:

```markdown
# HVAC Estimate App

## 🌐 Live Demo

- **Frontend**: https://hvac-estimate-app.vercel.app
- **Backend API**: https://hvac-estimate-backend.onrender.com/api/health

Try it now! Fill out the form and download a professional HVAC estimate.
```

Commit and push:

```bash
git add README.md
git commit -m "Add live demo links"
git push
```

---

## 🎉 You're Done!

Share these with hiring managers:

### **Live Application**
🔗 https://hvac-estimate-app.vercel.app

### **GitHub Repository**
🔗 https://github.com/YOUR_USERNAME/hvac-estimate-app

### **Backend API Health Check**
🔗 https://hvac-estimate-backend.onrender.com/api/health

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- Takes ~30 seconds to wake up on first request
- Database is ephemeral (resets when service restarts)
- Perfect for demos and portfolios

**Vercel Free Tier:**
- No sleep time
- Fast global CDN
- Unlimited bandwidth
- Perfect for frontend hosting

### For Long-term Production

If you want persistent database and no sleep time:
- Upgrade Render to paid tier ($7/month)
- Or use Railway.app (has better free tier)
- Or deploy to AWS/DigitalOcean with PostgreSQL

---

## 🐛 Troubleshooting

### Issue: "First load is slow"
**Cause**: Render free tier spins down after inactivity  
**Solution**: This is normal. After 30 seconds it will be fast.

### Issue: "CORS error in browser console"
**Cause**: Frontend URL not in backend's allowed origins  
**Solution**: Make sure you updated CORS in Step 5

### Issue: "Database is empty after redeploy"
**Cause**: Render free tier has ephemeral storage  
**Solution**: This is normal for free tier. For persistence, upgrade to paid plan.

### Issue: "Build failed on Render"
**Cause**: Missing dependencies or TypeScript errors  
**Solution**: 
```bash
# Test locally first
cd server
npm install
npx tsc --noEmit
npm start
```

### Issue: "Vercel build failed"
**Cause**: TypeScript compilation errors  
**Solution**:
```bash
cd client
npm run build
# Fix any errors shown
```

---

## 🔄 Continuous Deployment

Now whenever you push to GitHub:
- **Render**: Auto-redeploys backend (takes 2-3 min)
- **Vercel**: Auto-redeploys frontend (takes 30 sec)

Just commit and push:
```bash
git add .
git commit -m "Your changes"
git push
```

Both services automatically deploy! 🚀

---

## 📊 Monitoring

### Render Dashboard
- View logs: https://dashboard.render.com
- Check deployment status
- Monitor errors

### Vercel Dashboard  
- View deployments: https://vercel.com/dashboard
- Check analytics
- Monitor performance

---

## 💼 For Your Resume/Portfolio

Add this to your resume:

**HVAC Estimate Generator** | [Live Demo](https://hvac-estimate-app.vercel.app) | [GitHub](https://github.com/YOUR_USERNAME/hvac-estimate-app)
- Full-stack TypeScript application with React 19 and Express
- PDF/Excel export with professional formatting using PDFKit and ExcelJS
- SQLite database with full CRUD operations
- Deployed on Vercel (frontend) and Render (backend)
- Real-time form validation and responsive design

---

Need help? Check the troubleshooting section or contact me! 🚀
