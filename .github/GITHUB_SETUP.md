# GitHub Setup Guide

## Step 1: Initialize Git Repository

If you haven't already initialized git:

```bash
git init
git add .
git commit -m "Initial commit: HVAC Estimate App with CI/CD"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name it: `hvac-estimate-test`
4. Choose **Public** or **Private**
5. **Do NOT** initialize with README (we already have one)
6. Click **Create repository**

## Step 3: Connect Local Repo to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/hvac-estimate-test.git
git branch -M main
git push -u origin main
```

## Step 4: Verify CI/CD is Working

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see your first workflow running
4. Wait for it to complete (green checkmark = success)

## Step 5: Update README Badge

In `README.md`, replace this line:
```markdown
![CI/CD](https://github.com/YOUR_USERNAME/hvac-estimate-test/workflows/CI%2FCD%20Pipeline/badge.svg)
```

With your actual username:
```markdown
![CI/CD](https://github.com/yourusername/hvac-estimate-test/workflows/CI%2FCD%20Pipeline/badge.svg)
```

Then commit and push:
```bash
git add README.md
git commit -m "Update CI/CD badge with correct username"
git push
```

## Step 6: Enable Branch Protection (Recommended)

1. Go to repository **Settings**
2. Click **Branches** in the left sidebar
3. Click **Add branch protection rule**
4. Branch name pattern: `main`
5. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks that are required: Select your CI/CD workflow
6. Click **Create**

Now you can only merge to `main` if CI/CD passes!

## Working with Branches

### Create a feature branch:
```bash
git checkout -b feature/add-new-feature
# Make your changes
git add .
git commit -m "Add new feature"
git push origin feature/add-new-feature
```

### Create Pull Request:
1. Go to GitHub repository
2. Click **Pull requests** → **New pull request**
3. Select your feature branch
4. Click **Create pull request**
5. CI/CD will run automatically
6. Once it passes and is reviewed, merge to `main`

## Deployment

### Deploy Frontend to Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Vercel will auto-detect Vite

4. **Set environment variable:**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add: `VITE_API_URL` = your backend URL

### Deploy Backend to Render:

1. Go to [Render](https://render.com) and sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: hvac-estimate-backend
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables if needed
6. Click **Create Web Service**

### Auto-Deploy on Push:

Both Vercel and Render can auto-deploy when you push to `main`:

- **Vercel**: Automatically deploys on every push
- **Render**: Go to Settings → Enable **Auto-Deploy**

## Troubleshooting

### CI fails with "npm ci" error:
- Make sure you have `package-lock.json` files:
  ```bash
  cd server && npm install
  cd ../client && npm install
  ```
- Commit the lock files:
  ```bash
  git add package-lock.json
  git commit -m "Add package-lock.json"
  git push
  ```

### Build fails:
- Run locally first: `npm run build`
- Fix any errors
- Push the fixes

### Can't push to GitHub:
- Check you have the correct remote:
  ```bash
  git remote -v
  ```
- If wrong, update it:
  ```bash
  git remote set-url origin https://github.com/YOUR_USERNAME/hvac-estimate-test.git
  ```

## Next Steps

- ✅ Set up branch protection
- ✅ Deploy to Vercel/Render
- ✅ Add tests (see `.github/CICD.md`)
- ✅ Configure environment variables
- ✅ Set up monitoring (optional)

Happy coding! 🚀
