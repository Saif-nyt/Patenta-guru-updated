const fs = require('fs');
const master = JSON.parse(fs.readFileSync('patenteguru_all_questions.json', 'utf8'));

const translationMap = new Map();
master.forEach(q => {
  if (q.questionIt) {
    translationMap.set(q.questionIt.trim(), {
      bn: q.questionBn,
      en: q.questionEn
    });
  }
});

const rqContent = fs.readFileSync('src/data/roundQuestions.ts', 'utf8');
const regex = /"questionIt":\s*"([^"]+)",\s*"questionBn":\s*"([^"]+)"/g;
let m = regex.exec(rqContent);
if (m) {
  console.log('IT:', m[1]);
  console.log('roundQuestions.ts OLD BN:', m[2]);
  const newTrans = translationMap.get(m[1].trim());
  console.log('New Master BN:', newTrans?.bn);
  console.log('New Master EN:', newTrans?.en);
}

