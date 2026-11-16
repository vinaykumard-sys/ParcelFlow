import fs from 'fs';
import path from 'path';

const sqlPath = path.join(process.cwd(), 'database', '00_PARCELFLOW_ALL_IN_ONE.sql');
const content = fs.readFileSync(sqlPath, 'utf8');

// Parse CREATE TABLE definitions
const tables = {};
const tableRegex = /CREATE TABLE IF NOT EXISTS public\.(\w+)\s*\(([\s\S]*?)\);/g;
let match;
while ((match = tableRegex.exec(content)) !== null) {
  const tableName = match[1];
  const body = match[2];
  const columns = [];
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') || trimmed.startsWith('CONSTRAINT') || !trimmed) continue;
    const colMatch = trimmed.match(/^([a-zA-Z_]\w*)\s+/);
    if (colMatch) {
      columns.push(colMatch[1]);
    }
  }
  tables[tableName] = columns;
}

console.log('Detected tables and their columns:');
for (const [t, cols] of Object.entries(tables)) {
  console.log(`  ${t.padEnd(25)}: [${cols.join(', ')}]`);
}

// Now check policies
console.log('\nChecking policies:');
const policyRegex = /CREATE POLICY "([^"]+)" ON public\.(\w+)\s+(?:FOR\s+[A-Z]+\s+)?TO\s+\w+\s+USING\s*\(([\s\S]*?)\)(?:\s+WITH CHECK\s*\(([\s\S]*?)\))?;/g;
let pMatch;
while ((pMatch = policyRegex.exec(content)) !== null) {
  const [_, policyName, tableName, usingClause, checkClause] = pMatch;
  const tableCols = tables[tableName] || [];
  
  // Check if society_id is referenced bare in usingClause or checkClause
  const clauses = [usingClause, checkClause].filter(Boolean).join(' ');
  
  // Look for bare column references like `society_id =` or `society_id IS`
  if (/\bsociety_id\s*(=|IS|IN)/i.test(clauses)) {
    if (!tableCols.includes('society_id')) {
      console.log(`[INVALID COLUMN] Policy "${policyName}" on table "${tableName}" references society_id, but "${tableName}" does NOT have a society_id column!`);
    }
  }
}
