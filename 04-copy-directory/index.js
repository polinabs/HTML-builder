const fs = require('fs');
const path = require('path');

async function copyFile(sourcePath, destPath) {
  try {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath);

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

  } catch (error) {
    console.error(`Error copying file ${sourcePath}:`, error);
  }
}

async function copyDirectory() {
  const source = path.join(__dirname, 'files');
  const destination = path.join(__dirname, 'files-copy');

  try {
    await fs.promises.mkdir(destination, { recursive: true });

    const files = await fs.promises.readdir(source);

    await Promise.all(files.map(async (file) => {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);
      await copyFile(sourcePath, destPath);
    }));

    console.log('The files were copied successfully.');
  } catch (error) {
    console.error('Error copying file: ', error);
  }
}

copyDirectory();