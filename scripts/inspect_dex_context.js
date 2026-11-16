import fs from 'fs';

const dex = fs.readFileSync('apk_temp/classes.dex');
console.log('0x1de0:', dex.slice(0x1de0, 0x1e10).toString('utf8'));
console.log('0x24c0:', dex.slice(0x24c0, 0x24f0).toString('utf8'));
console.log('0x2500:', dex.slice(0x2500, 0x2540).toString('utf8'));
console.log('0x2ea0:', dex.slice(0x2ea0, 0x2f50).toString('utf8'));
