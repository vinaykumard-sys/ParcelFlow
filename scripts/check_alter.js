import fs from 'fs';

const content = fs.readFileSync('database/00_PARCELFLOW_ALL_IN_ONE.sql', 'utf8');

const tables = [
  'apartments',
  'residents',
  'staff',
  'storage_locations',
  'parcels',
  'pickup_slots',
  'pickup_bookings',
  'notifications',
  'audit_logs',
  'issues'
];

tables.forEach(t => {
  const hasAlter = content.includes(`ALTER TABLE public.${t} ADD COLUMN IF NOT EXISTS society_id`);
  console.log(`Table ${t} has ALTER TABLE ADD COLUMN IF NOT EXISTS society_id: ${hasAlter}`);
});
