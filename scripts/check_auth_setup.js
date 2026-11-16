import fs from 'fs';

const authSql = fs.readFileSync('database/auth_and_admin_setup.sql', 'utf8');
const lines = authSql.split('\n');
const start = lines.findIndex(l => l.includes('vinaykumard45678@gmail.com'));
console.log(lines.slice(Math.max(0, start - 10), Math.min(lines.length, start + 60)).join('\n'));
