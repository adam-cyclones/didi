const bumpType = require('../release/.version-bump-type.json');
console.log(bumpType.map(types => `--${types}`).join(' '));