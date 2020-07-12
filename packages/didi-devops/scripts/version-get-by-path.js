const { resolve } = require('path');
const pathToPackageJson = process.argv.slice(2)[0];
const { version } = require(resolve(pathToPackageJson, 'package.json'));
console.log(version);