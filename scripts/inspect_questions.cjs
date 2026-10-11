const fs = require('fs');

const rqContent = fs.readFileSync('./src/data/roundQuestions.ts', 'utf8');
const itMatches = [];
const regex = /"questionIt":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(rqContent)) !== null) {
  itMatches.push(m[1]);
}
console.log('Total questionIt in roundQuestions.ts:', itMatches.length);
const uniqueIt = Array.from(new Set(itMatches));
console.log('Unique questionIt in roundQuestions.ts:', uniqueIt.length);

const allPart = rqContent.substring(rqContent.indexOf('export const ALL_200_QUESTIONS'));
const allQuestionsInArray = [];
let am;
while ((am = regex.exec(allPart)) !== null) {
  allQuestionsInArray.push(am[1]);
}
console.log('Total questions in ALL_200_QUESTIONS array:', allQuestionsInArray.length);

