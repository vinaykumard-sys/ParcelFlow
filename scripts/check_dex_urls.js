import fs from 'fs';
const buf = fs.readFileSync('apk_temp/classes.dex');
const text = buf.toString('latin1');
const matches = text.match(/file:[^\s\0"'\<\>]+/g);
console.log('file URLs:', matches);
