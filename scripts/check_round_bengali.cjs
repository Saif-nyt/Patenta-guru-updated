const fs = require('fs');
const content = fs.readFileSync('./src/data/roundQuestions.ts', 'utf8');

const regex = /"questionBn":\s*"([^"]*)"/g;
let m;
let total = 0;
let withPlaceholder = 0;
let authentic = 0;

while ((m = regex.exec(content)) !== null) {
  total++;
  if (m[1].includes('শীঘ্রই') || m[1].length < 3) {
    withPlaceholder++;
  } else {
    authentic++;
  }
}

console.log('Total questionBn in roundQuestions.ts:', total);
console.log('Authentic Bengali translations:', authentic);
console.log('With placeholder (শীঘ্রই):', withPlaceholder);

