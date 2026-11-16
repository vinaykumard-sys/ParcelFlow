import fs from 'fs';

const content = fs.readFileSync('database/00_PARCELFLOW_ALL_IN_ONE.sql', 'utf8');
console.log(content.split('\n').slice(0, 110).join('\n'));
