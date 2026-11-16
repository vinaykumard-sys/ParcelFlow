import fs from 'fs';

const content = fs.readFileSync('database/00_PARCELFLOW_ALL_IN_ONE.sql', 'utf8');
console.log('Total characters in 00_PARCELFLOW_ALL_IN_ONE.sql:', content.length);
console.log('Total lines:', content.split('\n').length);
