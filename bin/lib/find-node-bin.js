const path = require('path');
const fs = require('fs');

module.exports = function findNodeBin(nodeModuleBin) {
  const absolutePath = path.resolve(process.cwd());
  const systemRoot = path.parse(absolutePath).root;
  let currentDir = path.dirname(__dirname);

  let binFound = fs.existsSync(path.resolve(currentDir, 'node_modules', '.bin', nodeModuleBin));
  while (!binFound) {
    if (path.dirname(currentDir) === systemRoot) {
      throw new Error(`Could not find '${nodeModuleBin}' file in the path heirarchy of ${absolutePath}`);
    }
    currentDir = path.join(currentDir, '..');
    binFound = fs.existsSync(path.resolve(currentDir, 'node_modules', '.bin', nodeModuleBin));
  }

  return path.resolve(currentDir, 'node_modules', '.bin', nodeModuleBin);
};
