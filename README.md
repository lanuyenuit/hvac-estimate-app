# HVAC Estimate App

A full-stack application to generate HVAC service estimates and download them as PDF or Excel files.

## 🚀 Deployment

See **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** for step-by-step deployment instructions (~15 minutes).

### Quick Summary:
1. Push to GitHub
2. Deploy backend to Render.com (free)
3. Deploy frontend to Vercel (free)
4. Update URLs and CORS
5. Done! 🎉

---

## 🤝 For Hiring Managers

This project demonstrates:
- ✅ Full-stack TypeScript development (React 19 + Express)
- ✅ RESTful API design with proper error handling
- ✅ Database design and SQL (SQLite)
- ✅ File generation (PDF/Excel) with professional formatting
- ✅ Form validation and UX best practices
- ✅ Clean code architecture and TypeScript type safety
- ✅ Production deployment (Vercel + Render)

**Try it live!** Fill out the form and download a professional estimate in seconds.

---

## 📄 License

MIT
```

<!-- Update these links after deployment -->
- **Live App**: https://your-app.vercel.app (Update after deployment)
- **Backend API**: https://your-backend.onrender.com/api/health (Update after deployment)
- **GitHub**: https://github.com/YOUR_USERNAME/hvac-estimate-app (Update after deployment)

## Project Structure

```
hvac-estimate-test/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express backend (Node.js + TypeScript)
```

## How to Run the App

### Option 1: Run Both Together (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```
The backend will run on `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`

### Option 2: Quick Start

1. **Install dependencies** (first time only):
```bash
# In server folder
cd server
npm install

# In client folder
cd ../client
npm install
```

2. **Start the backend:**
```bash
cd server
npm start
```

3. **Start the frontend (in a new terminal):**
```bash
cd client
npm run dev
```

4. **Open your browser:**
   - Go to `http://localhost:5173`
   - Fill out the HVAC estimate form
   - Click "Download PDF" or "Download Excel" to generate the file

## API Endpoints

### Download Endpoints

**POST `/api/estimate/download?format=pdf`**
- Generate and download a PDF estimate
- Automatically saves to database

**POST `/api/estimate/download?format=excel`**
- Generate and download an Excel estimate
- Automatically saves to database

### Database API Endpoints

## Testing

Fill out the form with sample data:
- **Unit Number:** HVAC-001
- **Model Number:** XR-2000
- **Location:** Building A, Floor 2
- **Issue:** AC not cooling properly
- **Labor Cost:** 500
- **Parts Cost:** 800
- **Service Fee:** 200
- **Total:** 1500 (calculated automatically)

Then click "Download PDF" to test the PDF generation!

## Database

The app uses SQLite to store all estimates. The database file is located at `server/estimates.db`.

### View Database Contents

**Using the view-data.js script (Recommended)**
```bash
cd server
node view-data.js
```
This will display all estimates in a formatted table with statistics.


### API Endpoints for Database

- `GET /api/estimates` - Get all estimates (with pagination)
- `GET /api/estimate/:id` - Get specific estimate by ID
- `GET /api/estimates/search?q=keyword` - Search estimates
- `POST /api/estimate/save` - Manually save an estimate
- `DELETE /api/estimate/:id` - Delete an estimate
- `GET /api/stats` - Get database statistics

### Database Schema

```sql
CREATE TABLE estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_number TEXT NOT NULL,
  model_number TEXT NOT NULL,
  location TEXT NOT NULL,
  issue TEXT NOT NULL,
  labor_cost REAL DEFAULT 0,
  parts_cost REAL DEFAULT 0,
  service_fee REAL DEFAULT 0,
  total_cost REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- SCSS

**Backend:**
- Node.js
- Express
- TypeScript
- PDFKit (PDF generation)
- ExcelJS (Excel generation)
- SQLite (better-sqlite3)
- CORS enabled
