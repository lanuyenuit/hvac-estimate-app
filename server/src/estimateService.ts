import { db } from './database.js';

export interface EstimateData {
  unitNumber: string;
  modelNumber: string;
  location: string;
  issue: string;
  laborCost: number | string;
  partsCost: number | string;
  serviceFee: number | string;
  totalCost: number;
}

export interface EstimateRecord extends EstimateData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export class EstimateService {
  // Create new estimate
  static create(data: EstimateData): number {
    const stmt = db.prepare(`
      INSERT INTO estimates (
        unit_number, model_number, location, issue,
        labor_cost, parts_cost, service_fee, total_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.unitNumber,
      data.modelNumber,
      data.location,
      data.issue,
      Number(data.laborCost || 0),
      Number(data.partsCost || 0),
      Number(data.serviceFee || 0),
      data.totalCost
    );

    return result.lastInsertRowid as number;
  }

  // Get estimate by ID
  static getById(id: number): EstimateRecord | undefined {
    const stmt = db.prepare(`
      SELECT 
        id,
        unit_number as unitNumber,
        model_number as modelNumber,
        location,
        issue,
        labor_cost as laborCost,
        parts_cost as partsCost,
        service_fee as serviceFee,
        total_cost as totalCost,
        created_at as createdAt,
        updated_at as updatedAt
      FROM estimates 
      WHERE id = ?
    `);

    return stmt.get(id) as EstimateRecord | undefined;
  }

  // Get all estimates with pagination
  static getAll(page: number = 1, limit: number = 20): {
    data: EstimateRecord[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const offset = (page - 1) * limit;

    // Get total count
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM estimates');
    const { count } = countStmt.get() as { count: number };

    // Get paginated data
    const stmt = db.prepare(`
      SELECT 
        id,
        unit_number as unitNumber,
        model_number as modelNumber,
        location,
        issue,
        labor_cost as laborCost,
        parts_cost as partsCost,
        service_fee as serviceFee,
        total_cost as totalCost,
        created_at as createdAt,
        updated_at as updatedAt
      FROM estimates 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    const data = stmt.all(limit, offset) as EstimateRecord[];

    return {
      data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  // Search estimates
  static search(query: string): EstimateRecord[] {
    const stmt = db.prepare(`
      SELECT 
        id,
        unit_number as unitNumber,
        model_number as modelNumber,
        location,
        issue,
        labor_cost as laborCost,
        parts_cost as partsCost,
        service_fee as serviceFee,
        total_cost as totalCost,
        created_at as createdAt,
        updated_at as updatedAt
      FROM estimates 
      WHERE 
        unit_number LIKE ? OR
        model_number LIKE ? OR
        location LIKE ? OR
        issue LIKE ?
      ORDER BY created_at DESC
    `);

    const searchTerm = `%${query}%`;
    return stmt.all(searchTerm, searchTerm, searchTerm, searchTerm) as EstimateRecord[];
  }

  // Delete estimate
  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM estimates WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get statistics
  static getStats(): {
    totalEstimates: number;
    totalRevenue: number;
    avgEstimate: number;
    recentEstimates: number;
  } {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as totalEstimates,
        COALESCE(SUM(total_cost), 0) as totalRevenue,
        COALESCE(AVG(total_cost), 0) as avgEstimate,
        SUM(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 ELSE 0 END) as recentEstimates
      FROM estimates
    `);

    return stmt.get() as any;
  }

  // Test database connection
  static testConnection(): boolean {
    try {
      const stmt = db.prepare('SELECT 1');
      stmt.get();
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}
