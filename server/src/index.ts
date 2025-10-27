import express, { type Request, type Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import './database.js'; // Initialize database
import { EstimateService } from './estimateService.js';

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://hvac-estimate-app.vercel.app',  // Production URL - use this!
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`⚠️  CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  try {
    const dbConnected = EstimateService.testConnection();
    const stats = EstimateService.getStats();
    
    res.json({
      status: 'healthy',
      database: dbConnected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      stats,
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ========================================
// DATABASE API ENDPOINTS
// ========================================

// Save estimate to database
app.post("/api/estimate/save", async (req: Request, res: Response) => {
  try {
    const { unitNumber, modelNumber, location, issue, laborCost, partsCost, serviceFee } = req.body;

    // Validate required fields
    if (!unitNumber || !modelNumber || !location || !issue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total
    const total = Number(laborCost || 0) + Number(partsCost || 0) + Number(serviceFee || 0);

    // Save to database
    const estimateId = EstimateService.create({
      unitNumber,
      modelNumber,
      location,
      issue,
      laborCost,
      partsCost,
      serviceFee,
      totalCost: total
    });

    res.json({ 
      success: true, 
      id: estimateId,
      message: 'Estimate saved successfully' 
    });
  } catch (error) {
    console.error('Error saving estimate:', error);
    res.status(500).json({ error: 'Failed to save estimate' });
  }
});

// Get all estimates with pagination
app.get("/api/estimates", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = EstimateService.getAll(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    res.status(500).json({ error: 'Failed to fetch estimates' });
  }
});

// Get estimate by ID
app.get("/api/estimate/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id!);
    const estimate = EstimateService.getById(id);

    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    res.json(estimate);
  } catch (error) {
    console.error('Error fetching estimate:', error);
    res.status(500).json({ error: 'Failed to fetch estimate' });
  }
});

// Search estimates
app.get("/api/estimates/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = EstimateService.search(query);
    res.json(results);
  } catch (error) {
    console.error('Error searching estimates:', error);
    res.status(500).json({ error: 'Failed to search estimates' });
  }
});

// Delete estimate
app.delete("/api/estimate/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id!);
    const deleted = EstimateService.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    res.json({ success: true, message: 'Estimate deleted successfully' });
  } catch (error) {
    console.error('Error deleting estimate:', error);
    res.status(500).json({ error: 'Failed to delete estimate' });
  }
});

// Get statistics
app.get("/api/stats", async (req: Request, res: Response) => {
  try {
    const stats = EstimateService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ========================================
// PDF/EXCEL DOWNLOAD ENDPOINT
// ========================================

app.post("/api/estimate/download", async (req, res) => {
  const {
    unitNumber,
    modelNumber,
    location,
    issue,
    laborCost,
    partsCost,
    serviceFee,
    totalCost
  } = req.body;

  const { format } = req.query;

  // Save to database before generating file
  try {
    const total = Number(laborCost || 0) + Number(partsCost || 0) + Number(serviceFee || 0);
    EstimateService.create({
      unitNumber,
      modelNumber,
      location,
      issue,
      laborCost,
      partsCost,
      serviceFee,
      totalCost: total
    });
    console.log('✅ Estimate saved to database');
  } catch (dbError) {
    console.error('⚠️  Database save failed:', dbError);
    // Continue with file generation even if DB save fails
  }

  if (format === 'pdf') {
    const doc = new PDFDocument({ margin: 50 });
    const today = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=hvac-estimate-${today}.pdf`);

    doc.pipe(res);

    doc.rect(0, 0, doc.page.width, 80).fill('#2563eb');

    doc.fillColor('#ffffff')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('HVAC Service Estimate', 50, 30, { align: 'center' });

    doc.fillColor('#000000').moveDown(2);

    doc.fontSize(10)
       .fillColor('#666666')
       .font('Helvetica')
       .text(`Estimate Date: ${today}`, { align: 'right' });

    doc.moveDown(1.5);

    const drawSection = (title: string, color: string) => {
      doc.rect(50, doc.y, doc.page.width - 100, 25)
         .fill(color);
      doc.fillColor('#ffffff')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(title, 60, doc.y + 7);
      doc.fillColor('#000000').moveDown(1.5);
    };

    const drawInfoRow = (label: string, value: string, indent: boolean = false) => {
      const x = indent ? 70 : 60;
      const currentY = doc.y;
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor('#374151')
         .text(label, x, currentY);
      doc.font('Helvetica')
         .fillColor('#000000')
         .text(value, x + 120, currentY);
      doc.moveDown(0.8);
    };

    drawSection('Unit Information', '#10b981');
    doc.moveDown(0.3);
    drawInfoRow('Unit Number:', unitNumber, true);
    drawInfoRow('Model Number:', modelNumber, true);
    drawInfoRow('Location:', location, true);
    doc.moveDown(1);

    drawSection('Service Details', '#f59e0b');
    doc.moveDown(0.3);
    const issueY = doc.y;
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#374151')
       .text('Issue:', 60, issueY);
    doc.font('Helvetica')
       .fillColor('#000000')
       .text(issue, 60, issueY + 20, {
         width: doc.page.width - 120,
         align: 'left'
       });
    doc.moveDown(2);

    drawSection('Cost Breakdown', '#8b5cf6');
    doc.moveDown(0.3);

    const drawCostRow = (label: string, amount: number) => {
      const y = doc.y;
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#374151')
         .text(label, 70, y);
      doc.font('Helvetica-Bold')
         .fillColor('#000000')
         .text(`$${amount.toFixed(2)}`, doc.page.width - 150, y, { width: 100, align: 'right' });
      doc.moveDown(0.8);
    };

    drawCostRow('Labor Cost:', Number(laborCost || 0));
    drawCostRow('Parts Cost:', Number(partsCost || 0));
    drawCostRow('Service Fee:', Number(serviceFee || 0));

    doc.moveDown(0.5);
    doc.moveTo(70, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke('#d1d5db');
    doc.moveDown(0.8);

    doc.rect(50, doc.y - 5, doc.page.width - 100, 35)
       .fill('#fef3c7');
    const totalY = doc.y + 5;
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#92400e')
       .text('Total Estimate:', 60, totalY);
    doc.fontSize(20)
       .fillColor('#78350f')
       .text(`$${Number(totalCost).toFixed(2)}`, doc.page.width - 200, totalY, { 
         width: 150, 
         align: 'right' 
       });

    doc.moveDown(3);
    doc.fontSize(8)
       .fillColor('#9ca3af')
       .font('Helvetica')
       .text('This estimate is valid for 30 days from the date of issue.', 50, doc.page.height - 80, {
         align: 'center',
         width: doc.page.width - 100
       });
    doc.text('Thank you for your business!', {
      align: 'center',
      width: doc.page.width - 100
    });

    doc.end();
  } else if (format === 'excel') {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('HVAC Estimate');
      const today = new Date().toISOString().split('T')[0];

      worksheet.columns = [
        { key: 'label', width: 30 },
        { key: 'value', width: 35 }
      ];

      worksheet.mergeCells('A1:B1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'HVAC SERVICE ESTIMATE';
      titleCell.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
      };
      worksheet.getRow(1).height = 35;

      worksheet.addRow([]);

      const dateRow = worksheet.addRow(['Estimate Date:', today]);
      dateRow.font = { bold: true, size: 11 };
      dateRow.getCell(2).font = { size: 11 };

      worksheet.addRow([]);

      const unitHeaderRow = worksheet.addRow(['UNIT INFORMATION']);
      worksheet.mergeCells(`A${unitHeaderRow.number}:B${unitHeaderRow.number}`);
      unitHeaderRow.font = { bold: true, size: 12 };
      unitHeaderRow.alignment = { horizontal: 'left', vertical: 'middle' };
      unitHeaderRow.height = 25;

      const addRow = (label: string, value: string) => {
        const row = worksheet.addRow([label, value]);
        row.getCell(1).font = { bold: true, size: 11 };
        row.getCell(2).font = { size: 11 };
        row.height = 20;
      };

      addRow('Unit Number:', unitNumber);
      addRow('Model Number:', modelNumber);
      addRow('Location:', location);

      worksheet.addRow([]);

      const serviceHeaderRow = worksheet.addRow(['SERVICE DETAILS']);
      worksheet.mergeCells(`A${serviceHeaderRow.number}:B${serviceHeaderRow.number}`);
      serviceHeaderRow.font = { bold: true, size: 12 };
      serviceHeaderRow.alignment = { horizontal: 'left', vertical: 'middle' };
      serviceHeaderRow.height = 25;

      const issueRow = worksheet.addRow(['Issue Description:', issue]);
      issueRow.getCell(1).font = { bold: true, size: 11 };
      issueRow.getCell(2).font = { size: 11 };
      issueRow.getCell(2).alignment = { wrapText: true, vertical: 'top' };
      issueRow.height = 30;

      worksheet.addRow([]);

      const costHeaderRow = worksheet.addRow(['COST BREAKDOWN']);
      worksheet.mergeCells(`A${costHeaderRow.number}:B${costHeaderRow.number}`);
      costHeaderRow.font = { bold: true, size: 12 };
      costHeaderRow.alignment = { horizontal: 'left', vertical: 'middle' };
      costHeaderRow.height = 25;

      const addCostRow = (label: string, amount: number) => {
        const row = worksheet.addRow([label, `$${amount.toFixed(2)}`]);
        row.getCell(1).font = { size: 11 };
        row.getCell(2).font = { size: 11, bold: true };
        row.getCell(2).alignment = { horizontal: 'right' };
        row.height = 20;
      };

      addCostRow('Labor Cost:', Number(laborCost || 0));
      addCostRow('Parts Cost:', Number(partsCost || 0));
      addCostRow('Service Fee:', Number(serviceFee || 0));

      worksheet.addRow([]);

      const totalRow = worksheet.addRow(['TOTAL ESTIMATE', `$${Number(totalCost).toFixed(2)}`]);
      totalRow.font = { bold: true, size: 14 };
      totalRow.getCell(2).alignment = { horizontal: 'right', vertical: 'middle' };
      totalRow.height = 30;

      const firstDataRow = 3;
      const lastDataRow = totalRow.number;

      for (let i = firstDataRow; i <= lastDataRow; i++) {
        const row = worksheet.getRow(i);
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber <= 2) {
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } }
            };
          }
        });
      }

      worksheet.addRow([]);
      worksheet.addRow([]);

      const footerRow = worksheet.addRow(['This estimate is valid for 30 days from the date of issue.']);
      worksheet.mergeCells(`A${footerRow.number}:B${footerRow.number}`);
      footerRow.font = { size: 9, italic: true, color: { argb: 'FF6B7280' } };
      footerRow.alignment = { horizontal: 'center' };

      const thankYouRow = worksheet.addRow(['Thank you for your business!']);
      worksheet.mergeCells(`A${thankYouRow.number}:B${thankYouRow.number}`);
      thankYouRow.font = { size: 10, bold: true };
      thankYouRow.alignment = { horizontal: 'center' };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=hvac-estimate-${today}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Excel generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Failed to generate Excel file', details: errorMessage });
    }
  } else {
    res.status(400).json({ error: 'Invalid format. Use ?format=pdf or ?format=excel' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Ready to accept requests!`);
});