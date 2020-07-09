const { promises } = require('fs');
const { join } = require('path');
const version = process.argv.slice(2)[0];
const { writeFile } = promises;


const {
  name,
  description,
  license,
  private
} = require('../package.json');

const {
  bin,
} = require('../packages/didi-cli-client/package.json');

const distPackageJson = {
  genereated: Date.now(),
  name,
  version,
  description,
  license,
  bin: { [Object.keys(bin)[0]]: join('didi-cli-client', bin[Object.keys(bin)[0]]) },
  repository: 'https://github.com/adam-cyclones/didi',
}

writeFile('./didi-release/package.json', JSON.stringify(distPackageJson, null, 4));

