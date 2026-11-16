import fs from 'fs';

const types = fs.readFileSync('backend/types.ts', 'utf8');
const start = types.indexOf('export interface Society');
console.log(types.slice(start, start + 600));
