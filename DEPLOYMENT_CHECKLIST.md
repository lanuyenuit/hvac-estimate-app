# 🚀 Quick Deployment Checklist

Follow these steps in order. Total time: ~15 minutes.

## ✅ Pre-Deployment Checklist

- [ ] Code is working locally
- [ ] Both frontend and backend run without errors
- [ ] Database is saving data correctly
- [ ] PDF and Excel downloads work

## 📝 Step-by-Step Deployment

### 1. Push to GitHub (5 min)

```bash
# In project root
git init
git add .
git commit -m "Ready for deployment"

# Create repo on github.com/new, then:
git remote add origin https://github.com/YOUR_USERNAME/hvac-estimate-app.git
git branch -M main
git push -u origin main
```

- [ ] Code is on GitHub
- [ ] Repository is public

### 2. Deploy Backend to Render (5 min)

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - Name: `hvac-estimate-backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance: Free
5. Click "Create Web Service"
6. Wait for deployment (~3 minutes)

- [ ] Backend deployed successfully
- [ ] Copied backend URL: `https://_____________________.onrender.com`

### 3. Update Frontend Config (2 min)

```bash
# Edit: client/src/services/api.service.ts
# Line 4-5: Replace with your Render URL

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://YOUR-BACKEND-URL.onrender.com'  // ← Paste your URL here
  : 'http://localhost:3000';
```

```bash
git add client/src/services/api.service.ts
git commit -m "Update API URL for production"
git push
```

- [ ] Updated API URL
- [ ] Committed and pushed

### 4. Deploy Frontend to Vercel (3 min)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel login
vercel --prod
```

Answer prompts:
- Set up and deploy? **Yes**
- Which scope? **[Your account]**
- Link to existing project? **No**
- Project name? **hvac-estimate-app**
- In which directory? **./  (just press Enter)**
- Override settings? **No**

- [ ] Frontend deployed
- [ ] Copied frontend URL: `https://_____________________.vercel.app`

### 5. Update Backend CORS (2 min)

```bash
# Edit: server/src/index.ts
# Line 14: Add your Vercel URL

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://YOUR-FRONTEND-URL.vercel.app',  // ← Paste your URL here
];
```

```bash
git add server/src/index.ts
git commit -m "Update CORS for production"
git push
```

- [ ] Updated CORS
- [ ] Committed and pushed
- [ ] Render auto-redeployed (check dashboard)

### 6. Test Deployment ✅

**Test Backend:**
```
Open: https://YOUR-BACKEND-URL.onrender.com/api/health
Should see: {"status":"healthy",...}
```

- [ ] Backend health check passes

**Test Frontend:**
```
Open: https://YOUR-FRONTEND-URL.vercel.app
1. Fill out form
2. Click "Download PDF"
3. PDF should download
```

- [ ] Frontend loads
- [ ] Form works
- [ ] PDF downloads successfully
- [ ] Excel downloads successfully

**Test Database:**
```
Open: https://YOUR-BACKEND-URL.onrender.com/api/estimates
Should see: Your saved estimates
```

- [ ] Data is persisting in database

### 7. Update README (1 min)

Add to top of README.md:

```markdown
## 🌐 Live Demo

- **Live App**: https://YOUR-FRONTEND-URL.vercel.app
- **Backend API**: https://YOUR-BACKEND-URL.onrender.com/api/health
- **GitHub**: https://github.com/YOUR_USERNAME/hvac-estimate-app

Try it now! Fill out the form and download a professional HVAC estimate.
```

```bash
git add README.md
git commit -m "Add live demo links"
git push
```

- [ ] README updated with live links

## 🎉 DONE!

### Share with Hiring Managers:

**Live Application:**
🔗 https://YOUR-FRONTEND-URL.vercel.app

**Source Code:**
🔗 https://github.com/YOUR_USERNAME/hvac-estimate-app

**Backend API:**
🔗 https://YOUR-BACKEND-URL.onrender.com/api/health

---

## 📝 Important Notes

### First Load Warning ⚠️

Render's free tier "sleeps" after 15 minutes of inactivity. The first visit takes ~30 seconds to wake up. This is NORMAL for free tier.

Tell hiring managers:
> "The backend is on Render's free tier which sleeps after inactivity. The first load may take 30 seconds to wake up, then it's fast!"

### Database Note ⚠️

Database is ephemeral on Render free tier. Data persists during active use but may reset if service restarts. This is normal for demo/portfolio purposes.

---

## 🐛 Troubleshooting

**Issue: CORS Error**
- Make sure you updated CORS in Step 5
- Check your Vercel URL is correct in `allowedOrigins`

**Issue: Backend slow on first load**
- This is normal for Render free tier
- Wait 30 seconds, then it's fast

**Issue: Build failed**
- Check Render logs in dashboard
- Make sure `npm start` works locally
- Check all dependencies are in package.json

**Issue: Frontend can't reach backend**
- Check API_BASE_URL in client/src/services/api.service.ts
- Make sure it matches your Render URL exactly

---

## ✅ All Done!

Your app is now live and ready to share with hiring managers! 🎉
