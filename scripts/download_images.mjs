import https from 'https';
import fs from 'fs';
import path from 'path';

const signsDir = path.resolve('public/signs');
if (!fs.existsSync(signsDir)) {
  fs.mkdirSync(signsDir, { recursive: true });
}

const rawQuestions = JSON.parse(fs.readFileSync('scripts/raw_questions.json', 'utf8'));
const imageIds = Array.from(new Set(rawQuestions.map(q => q.image).filter(img => img && img !== 0))).sort((a, b) => a - b);

console.log(`🖼️ Found ${imageIds.length} unique road sign images to download.`);

async function downloadImage(id) {
  const filePath = path.join(signsDir, `${id}.gif`);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 100) {
    return true; // already downloaded
  }

  const url = `https://raw.githubusercontent.com/avalla/quiz-patente-ab/master/public/images/${id}.gif`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function run() {
  let downloaded = 0;
  let batchSize = 25;
  for (let i = 0; i < imageIds.length; i += batchSize) {
    const batch = imageIds.slice(i, i + batchSize);
    await Promise.all(batch.map(id => downloadImage(id)));
    downloaded += batch.length;
    process.stdout.write(`\rProgress: ${downloaded} / ${imageIds.length} images...`);
  }
  console.log('\n✅ All road sign images downloaded into public/signs/!');
}

run();

