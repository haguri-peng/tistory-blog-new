const fs = require('fs');
const path = require('path');

const distDir = 'dist'; // 빌드된 폴더 경로
const oldPath = '/images/'; // 변경할 기존 경로
const newPath = 'https://tistory4.daumcdn.net/tistory/2876097/skin/images/'; // 새로운 경로

function shouldProcessFile(filename) {
  return (
    filename === 'index.html' ||
    (filename.startsWith('index-') && filename.endsWith('.js'))
  );
}

function replaceInFile(filePath) {
  // console.log(filePath);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    const result = data.replace(new RegExp(oldPath, 'g'), newPath);

    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}:`, err);
      } else {
        console.log(`Updated ${filePath}`);
      }
    });
  });
}

function walkDir(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting file stats for ${filePath}:`, err);
          return;
        }

        if (stats.isDirectory()) {
          walkDir(filePath);
        } else if (stats.isFile() && shouldProcessFile(file)) {
          replaceInFile(filePath);
        }
      });
    });
  });
}

walkDir(distDir);
