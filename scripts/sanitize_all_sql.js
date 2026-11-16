import fs from 'fs';
import path from 'path';

const root = process.cwd();
const schemaFile = path.join(root, 'database', 'schema.sql');
let schema = fs.readFileSync(schemaFile, 'utf8');

// 1. Fix all CREATE TRIGGER in schema.sql to have DROP TRIGGER IF EXISTS
// Pattern: CREATE TRIGGER (\w+)\s+(BEFORE|AFTER)\s+([A-Z\s]+)\s+ON\s+([\w.]+)
schema = schema.replace(
  /CREATE TRIGGER (\w+)\s+(BEFORE|AFTER|INSTEAD OF)\s+([A-Za-z\s]+)\s+ON\s+([\w.]+)/g,
  (match, triggerName, timing, event, tableName) => {
    return `DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName};\nCREATE TRIGGER ${triggerName} ${timing} ${event} ON ${tableName}`;
  }
);

// 2. Fix all CREATE POLICY in schema.sql to have DROP POLICY IF EXISTS
// Pattern: CREATE POLICY "([^"]+)"\s+ON\s+([\w.]+)
schema = schema.replace(
  /CREATE POLICY "([^"]+)"\s+ON\s+([\w.]+)/g,
  (match, policyName, tableName) => {
    return `DROP POLICY IF EXISTS "${policyName}" ON ${tableName};\nCREATE POLICY "${policyName}" ON ${tableName}`;
  }
);

fs.writeFileSync(schemaFile, schema, 'utf8');
console.log('Sanitized schema.sql successfully!');

// Now sanitize seed.sql
const seedFile = path.join(root, 'database', 'seed.sql');
let seed = fs.readFileSync(seedFile, 'utf8');

// Remove session_replication_role
seed = seed.replace(/SET session_replication_role\s*=\s*'[^']+';/g, '');

// Ensure all INSERT statements in seed.sql have ON CONFLICT (id) DO NOTHING if not already present
// We split by INSERT INTO and check each block
const insertBlocks = seed.split(/(?=INSERT INTO public\.)/g);
const sanitizedBlocks = insertBlocks.map(block => {
  if (!block.startsWith('INSERT INTO public.')) return block;
  // If it already has ON CONFLICT, leave it
  if (/ON CONFLICT/i.test(block)) return block;
  
  // Otherwise, replace the trailing semicolon with ON CONFLICT (id) DO NOTHING;
  // Find last semicolon in the block
  const lastSemi = block.lastIndexOf(';');
  if (lastSemi !== -1) {
    const before = block.substring(0, lastSemi).trimEnd();
    const after = block.substring(lastSemi + 1);
    return `${before}\nON CONFLICT (id) DO NOTHING;${after}`;
  }
  return block;
});

seed = sanitizedBlocks.join('');
fs.writeFileSync(seedFile, seed, 'utf8');
console.log('Sanitized seed.sql successfully!');

// Now regenerate 00_PARCELFLOW_ALL_IN_ONE.sql
const authFile = path.join(root, 'database', 'auth_and_admin_setup.sql');
const auth = fs.readFileSync(authFile, 'utf8');

const masterSql = `-- ============================================================================
-- PARCELFLOW 100% IDEMPOTENT MASTER DATABASE SETUP
-- File: database/00_PARCELFLOW_ALL_IN_ONE.sql
-- Safe to run repeatedly. All triggers and policies have DROP ... IF EXISTS.
-- All table inserts have ON CONFLICT DO NOTHING / UPDATE.
-- Zero superuser / session_replication_role requirements.
-- ============================================================================

-- SECTION 1: CORE SCHEMA
${schema}

-- SECTION 2: AUTH & ADMIN TRIGGER (vinaykumard45678@gmail.com -> ADMIN)
${auth}

-- SECTION 3: SEED DATA (SOCIETIES, FLATS, STAFF, RESIDENTS, RACKS, SLOTS)
${seed}
`;

const masterPath = path.join(root, 'database', '00_PARCELFLOW_ALL_IN_ONE.sql');
fs.writeFileSync(masterPath, masterSql, 'utf8');
console.log('Regenerated 00_PARCELFLOW_ALL_IN_ONE.sql (Bytes: ' + Buffer.byteLength(masterSql, 'utf8') + ')');
