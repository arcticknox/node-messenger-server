const fs = require('fs');

let moduleExports = {};

const exportModules = (filename) => {
  if (filename === 'index.js') return;
  const splitKey = filename.split('.');
  splitKey.pop();
  let finalKey = '';
  splitKey.forEach((key) => {
    finalKey = finalKey + key.charAt(0).toUpperCase() + key.slice(1);
  });
  moduleExports[finalKey] = require(`./${filename}`);
};

fs.readdirSync(__dirname).forEach(exportModules);
console.log('Loading services...');
module.exports = moduleExports;