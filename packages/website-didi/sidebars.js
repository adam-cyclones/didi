const pgkManifest = require('../../ops/pkg-manifest.json');
const packageMap = {};
for (const pkg of pgkManifest) {
  packageMap[pkg.prefixedName] = [
    `api/packages/${pkg.prefixedName}/index`,
    `api/packages/${pkg.prefixedName}/globals`,
  ]
}

module.exports = {
  guideSidebar: {
    About: [
      'guide/concepts-explained',
    ],
    Guides: [
      'guide/getting-started',
      'guide/installation',
    ],
  },
  apiSidebar: {
    'api': [
      'api/packages'
    ],
    ...packageMap
  }
};
