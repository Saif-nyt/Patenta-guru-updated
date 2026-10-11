import https from 'https';
import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve('scripts');
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

const targetPath = path.join(scriptsDir, 'raw_questions.json');
const file = fs.createWriteStream(targetPath);

const url = 'https://raw.githubusercontent.com/avalla/quiz-patente-ab/master/src/services/questions.json';

console.log('Downloading official raw ministerial questions from:', url);

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed to download, status:', res.statusCode);
    process.exit(1);
  }

  res.pipe(file);

  file.on('finish', () => {
    file.close();
    const stats = fs.statSync(targetPath);
    console.log(`✅ Downloaded raw_questions.json successfully! (${stats.size} bytes)`);
    
    // Read and verify
    const questions = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    console.log(`📊 Total official questions loaded: ${questions.length}`);
  });
}).on('error', (err) => {
  console.error('Download error:', err.message);
  process.exit(1);
});

