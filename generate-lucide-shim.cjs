const fs = require('fs');
const path = require('path');

const cjs = require('./node_modules/lucide-react/dist/cjs/lucide-react.js');
const validKeys = Object.keys(cjs).filter(k => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) && k !== 'default');

const code = `// Auto-generated ESM wrapper for lucide-react
import _cjs from '../node_modules/lucide-react/dist/cjs/lucide-react.js';

export const {
${validKeys.map(k => `  ${k}`).join(',\n')}
} = _cjs as any;

export default _cjs;
`;

fs.writeFileSync(path.join(__dirname, 'src', 'lucide-shim.ts'), code, 'utf8');
console.log('Successfully generated src/lucide-shim.ts with', validKeys.length, 'exports');
