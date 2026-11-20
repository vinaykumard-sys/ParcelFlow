const fs = require('fs');
const p = require('path').join(__dirname, 'package_perfect_apk.js');
let src = fs.readFileSync(p, 'utf8');

// Replace any broken psExe value with the correct Windows PowerShell path
src = src.replace(
  /const psExe = '[^']*';/,
  "const psExe = 'C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe';"
);

const m = src.match(/const psExe = '(.+?)';/);
console.log('Fixed psExe to:', m ? m[1] : '(not found)');
fs.writeFileSync(p, src, 'utf8');
console.log('Done.');
