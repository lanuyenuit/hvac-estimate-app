# HVAC Estimate Application

## 🎯 Overview
A full-stack TypeScript application for generating HVAC service estimates with PDF and Excel export capabilities.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, SCSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (better-sqlite3)
- **PDF Generation**: PDFKit
- **Excel Generation**: ExcelJS
- **Validation**: Custom hooks with real-time validation

## ✨ Features
- ✅ Real-time form validation with touched field tracking
- ✅ PDF export with professional formatting
- ✅ Excel export with styled spreadsheets
- ✅ Automatic cost calculation
- ✅ Character counter for text areas
- ✅ Responsive design
- ✅ TypeScript for type safety
- ✅ Modular code architecture
- ✅ SQLite database for data persistence
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Search and pagination
- ✅ Statistics dashboard

## 🗄️ Database

This application uses **SQLite** for data storage:
- **Lightweight**: File-based database, no separate server needed
- **Fast**: In-process database with excellent performance
- **Portable**: Single file (`server/estimates.db`) contains all data
- **Zero configuration**: Works out of the box

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

### API Endpoints

**Estimates Management:**
- `POST /api/estimate/save` - Save new estimate
- `GET /api/estimates?page=1&limit=20` - Get all estimates (paginated)
- `GET /api/estimate/:id` - Get estimate by ID
- `GET /api/estimates/search?q=query` - Search estimates
- `DELETE /api/estimate/:id` - Delete estimate
- `GET /api/stats` - Get statistics

**File Generation:**
- `POST /api/estimate/download?format=pdf` - Generate PDF (auto-saves to DB)
- `POST /api/estimate/download?format=excel` - Generate Excel (auto-saves to DB)

## 📁 Project Structure