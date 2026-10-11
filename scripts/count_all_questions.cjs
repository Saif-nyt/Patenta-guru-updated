const fs = require('fs');

function extractQuestions(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const list = [];
  const re = /"questionIt":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    list.push(m[1]);
  }
  return list;
}

const rq = extractQuestions('./src/data/roundQuestions.ts');
const hq = extractQuestions('./src/data/hotshotQuestions.ts');
const qd = extractQuestions('./src/data/quizData.ts');

console.log('roundQuestions.ts questions:', rq.length);
console.log('hotshotQuestions.ts questions:', hq.length);
console.log('quizData.ts questions:', qd.length);

const all = [...rq, ...hq, ...qd];
const unique = new Set(all);
console.log('Total questions in app:', all.length);
console.log('Unique Italian questions in app:', unique.size);

