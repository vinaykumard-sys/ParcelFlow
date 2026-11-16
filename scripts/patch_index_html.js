import fs from 'fs';

let html = fs.readFileSync('apk_temp/assets/www/index.html', 'utf8');
if (!html.includes('<base href="./">')) {
  html = html.replace('<meta name="theme-color"', '<base href="./" />\n    <meta name="theme-color"');
  fs.writeFileSync('apk_temp/assets/www/index.html', html, 'utf8');
  console.log('Added base href to index.html');
}
