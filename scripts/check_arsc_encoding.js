import fs from 'fs';

const buf = fs.readFileSync('apk_temp/resources.arsc');
// Search ascii
const asciiIdx = buf.indexOf(Buffer.from('heatshield', 'utf8'));
console.log('ASCII index:', asciiIdx);

// Search utf16le
const utf16Idx = buf.indexOf(Buffer.from('heatshield', 'utf16le'));
console.log('UTF16LE index:', utf16Idx);
