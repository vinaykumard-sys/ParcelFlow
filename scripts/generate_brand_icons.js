import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// 1. SVG for Standard / Square Icon (64x64 base)
const squareSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" fill="none">
  <defs>
    <linearGradient id="box-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1626" />
      <stop offset="100%" stop-color="#060913" />
    </linearGradient>
    <filter id="box-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Background with rounded corners -->
  <rect width="108" height="108" rx="24" fill="url(#bg-grad)" />
  <rect x="1" y="1" width="106" height="106" rx="23" stroke="#2563EB" stroke-width="1.5" stroke-opacity="0.4" />
  
  <!-- 3D Parcel Isometric Box -->
  <!-- Outer cube -->
  <path d="M54 22L84 38V70L54 86L24 70V38L54 22Z" stroke="url(#box-grad)" stroke-width="4.5" stroke-linejoin="round" fill="#111B30" fill-opacity="0.9" />
  <!-- Inner cube segments -->
  <path d="M54 22V54M54 54L84 38M54 54L24 38" stroke="url(#box-grad)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Flow Lines / Center Node -->
  <circle cx="54" cy="54" r="6" fill="#10B981" filter="url(#box-glow)" />
  <circle cx="54" cy="54" r="3" fill="#FFFFFF" />
</svg>
`;

// 2. SVG for Round Icon (108x108 base)
const roundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" fill="none">
  <defs>
    <linearGradient id="box-grad-r" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <linearGradient id="bg-grad-r" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1626" />
      <stop offset="100%" stop-color="#060913" />
    </linearGradient>
    <filter id="box-glow-r" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Circle Background -->
  <circle cx="54" cy="54" r="53" fill="url(#bg-grad-r)" stroke="#2563EB" stroke-width="2" stroke-opacity="0.5" />
  
  <!-- 3D Parcel Isometric Box -->
  <path d="M54 24L82 39V69L54 84L26 69V39L54 24Z" stroke="url(#box-grad-r)" stroke-width="4.5" stroke-linejoin="round" fill="#111B30" fill-opacity="0.9" />
  <path d="M54 24V54M54 54L82 39M54 54L26 39" stroke="url(#box-grad-r)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  
  <circle cx="54" cy="54" r="6" fill="#10B981" filter="url(#box-glow-r)" />
  <circle cx="54" cy="54" r="3" fill="#FFFFFF" />
</svg>
`;

// 3. SVG for Adaptive Foreground (432x432 base, transparent background)
const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" fill="none">
  <defs>
    <linearGradient id="fg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <filter id="fg-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Centered Safe Zone 3D Parcel Isometric Box -->
  <path d="M216 110L316 168V282L216 340L116 282V168L216 110Z" stroke="url(#fg-grad)" stroke-width="14" stroke-linejoin="round" fill="#0E1626" fill-opacity="0.95" />
  <path d="M216 110V225M216 225L316 168M216 225L116 168" stroke="url(#fg-grad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  
  <circle cx="216" cy="225" r="22" fill="#10B981" filter="url(#fg-glow)" />
  <circle cx="216" cy="225" r="10" fill="#FFFFFF" />
</svg>
`;

// 4. SVG for Splash Screen Logo (512x512)
const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="sp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <linearGradient id="sp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1626" />
      <stop offset="100%" stop-color="#060913" />
    </linearGradient>
    <filter id="sp-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#sp-bg)" />
  
  <!-- Centered 3D Parcel Cube -->
  <path d="M256 120L366 184V310L256 374L146 310V184L256 120Z" stroke="url(#sp-grad)" stroke-width="16" stroke-linejoin="round" fill="#111B30" fill-opacity="0.9" />
  <path d="M256 120V247M256 247L366 184M256 247L146 184" stroke="url(#sp-grad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
  
  <circle cx="256" cy="247" r="24" fill="#10B981" filter="url(#sp-glow)" />
  <circle cx="256" cy="247" r="10" fill="#FFFFFF" />
</svg>
`;

async function generateAllIcons() {
  const sizes = [
    { dir: 'mipmap-mdpi-v4', size: 48 },
    { dir: 'mipmap-hdpi-v4', size: 72 },
    { dir: 'mipmap-xhdpi-v4', size: 96 },
    { dir: 'mipmap-xxhdpi-v4', size: 144 },
    { dir: 'mipmap-xxxhdpi-v4', size: 192 }
  ];

  for (const s of sizes) {
    const outDir = path.join('apk_temp/res', s.dir);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // Square
    const squareBuf = await sharp(Buffer.from(squareSvg)).resize(s.size, s.size).png().toBuffer();
    fs.writeFileSync(path.join(outDir, 'ic_launcher.png'), squareBuf);

    // Round
    const roundBuf = await sharp(Buffer.from(roundSvg)).resize(s.size, s.size).png().toBuffer();
    fs.writeFileSync(path.join(outDir, 'ic_launcher_round.png'), roundBuf);

    console.log(`Generated ${s.dir} (${s.size}x${s.size})`);
  }

  // Adaptive Foreground (432x432)
  const fgBuf = await sharp(Buffer.from(foregroundSvg)).resize(432, 432).png().toBuffer();
  fs.writeFileSync('apk_temp/res/drawable/ic_launcher_foreground.png', fgBuf);
  console.log('Generated drawable/ic_launcher_foreground.png (432x432)');

  // Splash Logo (512x512)
  const spBuf = await sharp(Buffer.from(splashSvg)).resize(512, 512).png().toBuffer();
  fs.writeFileSync('apk_temp/res/drawable/splash_logo.png', spBuf);
  console.log('Generated drawable/splash_logo.png (512x512)');
}

generateAllIcons();
