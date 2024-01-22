const fs = require('fs').promises;
const path = require('path');

async function fileInfo() {
  const secretFolderPath = path.join(__dirname, 'secret-folder');

  try {
    const files = await fs.readdir(secretFolderPath);

    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(secretFolderPath, file);
        const stats = await fs.stat(filePath);
        return { filePath, stats };
      })
    );

    fileStats.forEach((file) => {
      if (file.stats.isFile()) {
      const fileName = path.parse(file.filePath).name;
      const fileExt = path.parse(file.filePath).ext.slice(1);
      const fileSize = ( file.stats.size ) / 1024;

      console.log(`${fileName} - ${fileExt} - ${fileSize} kb`);
    }

    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

fileInfo();



