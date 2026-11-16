import fs from 'fs';

const authSql = fs.readFileSync('database/auth_and_admin_setup.sql', 'utf8');
const lines = authSql.split('\n');
const start = lines.findIndex(l => l.includes('v_admin_auth_id'));
console.log(lines.slice(Math.max(0, start - 5), Math.min(lines.length, start + 50)).join('\n'));
