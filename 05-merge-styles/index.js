const fs = require('fs').promises;
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

const isCssFile = (file) => path.extname(file) === '.css';

const readCssFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
};

const compileStyles = async () => {
  try {
    const filesInStylesFolder = await fs.readdir(stylesFolderPath);

    const cssFiles = filesInStylesFolder.filter(isCssFile);

    const stylesArray = await Promise.all(
      cssFiles.map(async (cssFile) => {
        const cssFilePath = path.join(stylesFolderPath, cssFile);
        return await readCssFile(cssFilePath);
      })
    );

    await fs.writeFile(bundleFilePath, stylesArray.join('\n'), 'utf8');

    console.log('bundle.css successfully created.');
  } catch (error) {
    console.error('Error compiling styles:', error);
  }
};

compileStyles();