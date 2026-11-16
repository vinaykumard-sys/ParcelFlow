import fs from 'fs';

const authSql = fs.readFileSync('database/auth_and_admin_setup.sql', 'utf8');
const lines = authSql.split('\n');
const start = lines.findIndex(l => l.includes('vinaykumard45678@gmail.com'));
console.log(lines.slice(start + 280, Math.min(lines.length, start + 360)).join('\n'));
