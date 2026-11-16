import fs from 'fs';

const buf = fs.readFileSync('classes.dex');
let cur = '';
const strings = [];
for (let i = 0; i < buf.length; i++) {
  const b = buf[i];
  if (b >= 32 && b <= 126) {
    cur += String.fromCharCode(b);
  } else {
    if (cur.length >= 3) {
      strings.push(cur);
    }
    cur = '';
  }
}

const appUrlIdx = strings.findIndex(s => s === 'APP_URL');
console.log('Strings around APP_URL:');
console.log(strings.slice(Math.max(0, appUrlIdx - 15), appUrlIdx + 30));
