import fs from 'fs';
const p = 'C:/Users/Vinay/.gemini/antigravity/brain/508ed170-7ecf-4c0c-957d-ab3d6c71d2db/.system_generated/logs/transcript.jsonl';
if (fs.existsSync(p)) {
  const lines = fs.readFileSync(p, 'utf8').trim().split('\n');
  console.log('Total steps:', lines.length);
  for (let i = Math.max(0, lines.length - 10); i < lines.length; i++) {
    const obj = JSON.parse(lines[i]);
    console.log(`Step ${i}: type=${obj.type}, source=${obj.source}`);
    if (obj.content) console.log('Content preview:', String(obj.content).slice(0, 150));
  }
}
