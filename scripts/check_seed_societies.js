import fs from 'fs';

const seed = fs.readFileSync('database/seed.sql', 'utf8');
console.log(seed.slice(0, 1500));
