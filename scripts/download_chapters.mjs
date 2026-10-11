import https from 'https';
import fs from 'fs';
import path from 'path';

const targetPath = path.resolve('scripts/raw_chapters.json');
const file = fs.createWriteStream(targetPath);
const url = 'https://raw.githubusercontent.com/avalla/quiz-patente-ab/master/src/services/chapters.json';

https.get(url, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    console.log(`✅ Downloaded raw_chapters.json! Total chapters: ${data.length}`);
  });
}).on('error', (err) => {
  console.error('Error downloading chapters:', err.message);
});

