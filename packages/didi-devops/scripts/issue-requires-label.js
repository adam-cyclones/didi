const fetch = require('node-fetch');
const { promises } = require('fs');
const { resolve } = require('path');
const { execSync } = require('child_process');

const { writeFile } = promises;

const issueID = execSync('git rev-parse --abbrev-ref HEAD', {encoding: 'utf8'}).match(/^#[\d]*/)[0].replace('#', '');

const mapUpdateType = (labelName) => {
  switch (labelName) {
    case 'bug':
      return 'patch';
    case 'structural enhancement':
    case 'enhancement':
      return 'minor';
    default:
      return '';
  }
}

;(async () => {
  const res = await fetch(`https://api.github.com/repos/adam-cyclones/didi/issues/${issueID}/labels`);
  const body = await res.json();
  const updateTypes = body.map((label) => {
    return mapUpdateType(label.name);
  }).filter(Boolean);

  if (updateTypes.length) {
    // write the semver update type for yarn version {type} - file should be generated on checkout hook.
    writeFile(resolve(process.cwd(), 'release', '.version-bump-type.json'), JSON.stringify(updateTypes), 'utf8');
  } else {
    throw new Error(`Issues cannot be checked out without a label: #${issueID} with either a 'bug' or 'enhancement' of 'structural enhancement' label. checkout has been canceled.`);
  }

})();