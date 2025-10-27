# CI/CD with GitHub Actions

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### CI/CD Pipeline (`.github/workflows/ci.yml`)

The pipeline runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

#### Jobs:

1. **Backend CI**
   - Tests on Node.js 18.x and 20.x
   - Checks TypeScript compilation
   - Runs linter (if configured)
   - Runs tests (if configured)
   - Builds the project

2. **Frontend CI**
   - Tests on Node.js 18.x and 20.x
   - Checks TypeScript compilation
   - Runs linter
   - Runs tests (if configured)
   - Builds production bundle
   - Uploads build artifacts

3. **Deploy** (only on `main` branch)
   - Runs after both backend and frontend pass
   - Downloads build artifacts
   - Ready for deployment configuration

## Setup Instructions

### 1. Initial Setup

Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit with CI/CD"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hvac-estimate-test.git
git push -u origin main
```

### 2. The CI/CD will automatically run when you:
- Push to `main` or `develop` branch
- Create a pull request to `main` or `develop`

### 3. View Results
- Go to your GitHub repository
- Click on "Actions" tab
- See your workflow runs and results

## Deployment Options

### Option 1: Deploy Frontend to Vercel

1. **Sign up at [Vercel](https://vercel.com)**

2. **Get your tokens:**
   - Go to Settings → Tokens → Create Token
   - Copy the token

3. **Add GitHub Secrets:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your org ID (from `.vercel/project.json`)
     - `VERCEL_PROJECT_ID`: Your project ID

4. **Uncomment the Vercel deployment section** in `.github/workflows/ci.yml`

### Option 2: Deploy Backend to Render

1. **Sign up at [Render](https://render.com)**

2. **Create a Web Service:**
   - Connect your GitHub repo
   - Root directory: `server`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Add environment variables if needed

3. **Auto-deploy on push** (Render does this automatically)

### Option 3: Deploy to Railway

1. **Sign up at [Railway](https://railway.app)**

2. **Create a new project:**
   - Connect GitHub repo
   - Railway auto-detects Node.js apps
   - Set root directory for backend: `server`

3. **Configure deployment:**
   - Builds automatically on push
   - Set environment variables in Railway dashboard

### Option 4: Manual Deployment

The CI/CD pipeline validates your code. You can deploy manually:

**Frontend:**
```bash
cd client
npm run build
# Upload ./dist folder to your hosting service
```

**Backend:**
```bash
cd server
npm install --production
npm start
# Deploy to your VPS/cloud provider
```

## Adding Tests

### Backend Tests
```bash
cd server
npm install --save-dev jest @types/jest ts-jest
```

Add to `server/package.json`:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### Frontend Tests
```bash
cd client
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Add to `client/package.json`:
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## Environment Variables

For production deployment, set these environment variables:

**Backend:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to `production`
- `DATABASE_URL` - Path to SQLite database (or connection string)

**Frontend:**
- `VITE_API_URL` - Backend API URL (e.g., `https://api.yourapp.com`)

## Troubleshooting

### CI Fails on TypeScript Check
- Run `npx tsc --noEmit` locally to see errors
- Fix TypeScript errors before pushing

### CI Fails on Build
- Make sure `npm run build` works locally
- Check if all dependencies are in `package.json`

### Deploy Job Doesn't Run
- Only runs on pushes to `main` branch
- Make sure frontend and backend jobs pass first

## Status Badge

Add this to your README to show build status:

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/hvac-estimate-test/workflows/CI%2FCD%20Pipeline/badge.svg)
```

## Best Practices

1. **Create feature branches:**
   ```bash
   git checkout -b feature/my-feature
   git push origin feature/my-feature
   ```

2. **Open Pull Requests:**
   - CI will run automatically
   - Review changes before merging to `main`

3. **Protected Branches:**
   - Go to Settings → Branches
   - Add branch protection rule for `main`
   - Require status checks to pass before merging

4. **Review build artifacts:**
   - Check the Actions tab after each run
   - Download and inspect build artifacts if needed
