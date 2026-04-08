const fs = require('fs');

const b64 = fs.readFileSync('e:/Project/RaxhuAI/components/logo.png', 'base64');
const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <image href='data:image/png;base64,${b64}' x='0' y='0' width='100' height='100' preserveAspectRatio='xMidYMid slice'/>
</svg>`;

fs.writeFileSync('e:/Project/RaxhuAI/components/logo.svg', svg);
