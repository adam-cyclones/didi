const args = process.argv;
const { resolve } = require('path');
const packageJson = require(resolve(process.cwd(), 'package.json'));
const { promises } = require('fs');

const { writeFile } = promises;

const pathToRewritePackageJson = resolve('../../release', args[2]);

delete packageJson.scripts;
delete packageJson.devDependencies;
packageJson.repository = 'https://github.com/adam-cyclones/didi';
packageJson.homepage = packageJson.repository;
packageJson.publishConfig = {
  "access": "public",
  "tag": "next"
}
packageJson.version = `${packageJson.version}-rc1`;

writeFile(pathToRewritePackageJson, JSON.stringify(packageJson, null, 2), 'utf8');

