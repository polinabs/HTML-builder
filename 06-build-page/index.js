const fs = require('fs').promises;
const path = require('path');

const sourcePath = path.join(__dirname);
const templatePath = path.join(sourcePath, 'template.html');
const distPath = path.join(sourcePath, 'project-dist');
const componentsPath = path.join(sourcePath, 'components');
const stylesPath = path.join(sourcePath, 'styles');
const assetsPath = path.join(sourcePath, 'assets');

async function copyAssets() {
  try {
    const imgPath = path.join(assetsPath, 'img');
    const fontsPath = path.join(assetsPath, 'fonts');
    const svgPath = path.join(assetsPath, 'svg');

    // img
    await copyDirectory(imgPath, path.join(distPath, 'assets', 'img'));

    // fonts
    await copyDirectory(fontsPath, path.join(distPath, 'assets', 'fonts'));

    // SVG
    await copyDirectory(svgPath, path.join(distPath, 'assets', 'svg'));

    // console.log('Assets success');
  } catch (error) {
    console.error(`Error copying assets: ${error.message}`);
  }
}

async function copyDirectory(source, destination) {
  try {
    await fs.mkdir(destination, { recursive: true });

    const files = await fs.readdir(source);

    await Promise.all(files.map(async (file) => {
      const sourcePath = path.join(source, file);
      const destinationPath = path.join(destination, file);

      const fileStats = await fs.stat(sourcePath);

      if (fileStats.isDirectory()) {
        await copyDirectory(sourcePath, destinationPath);
      } else {
        const fileContent = await fs.readFile(sourcePath);
        await fs.writeFile(destinationPath, fileContent);
      }
    }));

    // console.log('Assets success.');
  } catch (error) {
    console.error(`Error copying assets: ${error.message}`);
  }
}


async function main() {
  try {
    await fs.mkdir(distPath, { recursive: true });

    const templateContent = await fs.readFile(templatePath, 'utf-8');

    const templateTags = templateContent.match(/{{\s*([^}\s]+)\s*}}/g) || [];

    let modifiedTemplate = templateContent;

    await Promise.all(templateTags.map(async (tag) => {
      const componentName = tag.replace(/[{} ]/g, '');
      const componentFilePath = path.join(componentsPath, `${componentName}.html`);

      try {
        const componentContent = await fs.readFile(componentFilePath, 'utf-8');
        modifiedTemplate = modifiedTemplate.replace(tag, componentContent);
      } catch (error) {
        console.error(`Error reading component file for tag ${tag}: ${error.message}`);
      }
    }));

    const indexPath = path.join(distPath, 'index.html');
    await fs.writeFile(indexPath, modifiedTemplate);

    const styleFiles = await fs.readdir(stylesPath);

    const mergedStyles = await Promise.all(styleFiles.map(async (styleFile) => {
      const styleFilePath = path.join(stylesPath, styleFile);
      try {
        const styleContent = await fs.readFile(styleFilePath, 'utf-8');
        return styleContent;
      } catch (error) {
        console.error(`Error reading style file ${styleFile}: ${error.message}`);
        return '';
      }
    }));

    const styleContent = mergedStyles.join('\n');
    const styleFilePath = path.join(distPath, 'style.css');
    await fs.writeFile(styleFilePath, styleContent);

    await copyAssets();

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();


