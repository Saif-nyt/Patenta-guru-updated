const fs = require('fs');
const path = require('path');

const master = JSON.parse(fs.readFileSync('patenteguru_all_questions.json', 'utf8'));
const map = {};
master.forEach(q => {
  if (q.questionIt && q.questionEn) {
    map[q.questionIt.trim()] = q.questionEn.trim();
  }
});

console.log(`Creating patenteTranslationsEn.ts with ${Object.keys(map).length} English translations...`);

const target = path.resolve('src/data/patenteTranslationsEn.ts');
const fileContent = `// Auto-generated ministerial Italian -> English translations
export const PATENTE_TRANSLATIONS_EN: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;

fs.writeFileSync(target, fileContent, 'utf8');
console.log(`✅ Successfully created src/data/patenteTranslationsEn.ts!`);

