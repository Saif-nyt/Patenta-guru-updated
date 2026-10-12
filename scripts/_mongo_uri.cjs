const fs = require('fs');
const path = require('path');

function readDotEnvFile() {
  try {
    return fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');
  } catch {
    return '';
  }
}

function getMongoUri() {
  const fromProcess = process.env.MONGODB_URI?.trim();
  if (fromProcess) return fromProcess;

  const match = readDotEnvFile().match(/^MONGODB_URI=([^\r\n]+)/m);
  const fromFile = match?.[1]?.trim();
  if (!fromFile) {
    throw new Error('MONGODB_URI must be set in the environment or in the .env file');
  }
  return fromFile;
}

module.exports = { getMongoUri };
