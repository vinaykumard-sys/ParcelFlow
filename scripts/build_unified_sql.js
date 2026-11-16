import fs from 'fs';
import path from 'path';

const root = process.cwd();
const schemaPath = path.join(root, 'database', 'schema.sql');
const authPath = path.join(root, 'database', 'auth_and_admin_setup.sql');
const seedPath = path.join(root, 'database', 'seed.sql');
const outPath = path.join(root, 'database', '00_PARCELFLOW_ALL_IN_ONE.sql');

const schema = fs.readFileSync(schemaPath, 'utf8');
const auth = fs.readFileSync(authPath, 'utf8');
const seed = fs.readFileSync(seedPath, 'utf8');

const header = `-- ============================================================================
-- PARCELFLOW UNIFIED MASTER DATABASE SETUP
-- File: database/00_PARCELFLOW_ALL_IN_ONE.sql
-- Complete single-file script: Tables + Auth Trigger + RLS Policies + Admin Provisioning + Seed Data
-- Target: Supabase SQL Editor / PostgreSQL
-- ============================================================================

`;

const unified = `${header}
-- ============================================================================
-- PART 1: CORE SCHEMA
-- ============================================================================
${schema}

-- ============================================================================
-- PART 2: AUTH, PROFILES & ADMIN ROLE FOR vinaykumard45678@gmail.com
-- ============================================================================
${auth}

-- ============================================================================
-- PART 3: SEED DATA (SOCIETIES, FLATS, STAFF, RESIDENTS, RACKS, SLOTS)
-- ============================================================================
${seed}
`;

fs.writeFileSync(outPath, unified, 'utf8');
console.log('Successfully wrote', outPath, 'Bytes:', Buffer.byteLength(unified, 'utf8'));
