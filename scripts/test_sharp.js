import sharp from 'sharp';
import fs from 'fs';

const svg = fs.readFileSync('public/favicon.svg');

async function testSharp() {
  const buf = await sharp(svg).resize(192, 192).png().toBuffer();
  console.log('Successfully generated 192x192 PNG! Bytes:', buf.length);
}

testSharp();
