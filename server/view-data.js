import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'estimates.db');
const db = new Database(dbPath);

console.log('📊 Database location:', dbPath);
console.log('\n' + '='.repeat(80));

// Count total records
const countStmt = db.prepare('SELECT COUNT(*) as count FROM estimates');
const { count } = countStmt.get();
console.log(`\n📈 Total Estimates: ${count}\n`);

if (count === 0) {
  console.log('⚠️  No data found in database!');
  console.log('\n💡 To add data:');
  console.log('   1. Start your server: npm start');
  console.log('   2. Fill out the form at http://localhost:5173');
  console.log('   3. Click "Download PDF" or "Download Excel"');
  console.log('   4. Data will be automatically saved\n');
  
  console.log('Or add test data now? (y/n)');
  console.log('\n🧪 Adding sample data...\n');
  
  // Add sample data
  const insertStmt = db.prepare(`
    INSERT INTO estimates (
      unit_number, model_number, location, issue,
      labor_cost, parts_cost, service_fee, total_cost
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleData = [
    ['AC-001', 'XYZ-123', 'Building A - Floor 1', 'Air conditioner not cooling properly', 150, 75, 50, 275],
    ['AC-002', 'ABC-456', 'Building B - Floor 2', 'Heater making strange noise', 200, 120, 50, 370],
    ['AC-003', 'DEF-789', 'Building A - Floor 3', 'Thermostat not responding', 100, 45, 50, 195]
  ];

  sampleData.forEach(data => {
    const result = insertStmt.run(...data);
    console.log(`✅ Added estimate #${result.lastInsertRowid}: ${data[0]} - ${data[1]}`);
  });
  
  console.log('\n✨ Sample data added successfully!\n');
}

// Fetch and display all estimates
console.log('='.repeat(80));
console.log('\n📋 ALL ESTIMATES:\n');

const allEstimates = db.prepare(`
  SELECT 
    id,
    unit_number,
    model_number,
    location,
    issue,
    labor_cost,
    parts_cost,
    service_fee,
    total_cost,
    datetime(created_at, 'localtime') as created_at
  FROM estimates 
  ORDER BY created_at DESC
`).all();

allEstimates.forEach((estimate, index) => {
  console.log(`${index + 1}. Estimate #${estimate.id}`);
  console.log(`   Unit: ${estimate.unit_number} | Model: ${estimate.model_number}`);
  console.log(`   Location: ${estimate.location}`);
  console.log(`   Issue: ${estimate.issue}`);
  console.log(`   Costs: Labor=$${estimate.labor_cost} | Parts=$${estimate.parts_cost} | Service=$${estimate.service_fee}`);
  console.log(`   💰 TOTAL: $${estimate.total_cost}`);
  console.log(`   📅 Created: ${estimate.created_at}`);
  console.log('');
});

// Show statistics
console.log('='.repeat(80));
console.log('\n📊 STATISTICS:\n');

const stats = db.prepare(`
  SELECT 
    COUNT(*) as total_estimates,
    SUM(total_cost) as total_revenue,
    AVG(total_cost) as avg_estimate,
    MIN(total_cost) as min_estimate,
    MAX(total_cost) as max_estimate
  FROM estimates
`).get();

console.log(`Total Estimates: ${stats.total_estimates}`);
console.log(`Total Revenue: $${stats.total_revenue?.toFixed(2) || 0}`);
console.log(`Average Estimate: $${stats.avg_estimate?.toFixed(2) || 0}`);
console.log(`Lowest Estimate: $${stats.min_estimate?.toFixed(2) || 0}`);
console.log(`Highest Estimate: $${stats.max_estimate?.toFixed(2) || 0}`);

console.log('\n' + '='.repeat(80));
console.log('\n✅ Done!\n');

db.close();
