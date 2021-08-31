const JSZip = require('jszip');
const fs = require('fs');

module.exports = function zipFiles(files, path) {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.name, file.data);
  });

  return new Promise((res) => {
    zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(path))
      .on('finish', () => {
        res();
      });
  });
};
