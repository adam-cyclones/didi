const fetch = require('node-fetch');
const { execSync } = require('child_process');

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

module.exports = async () => {
  const issueID = execSync('git rev-parse --abbrev-ref HEAD', {encoding: 'utf8'}).match(/^#[\d]*/)[0].replace('#', '');
  const res = await fetch(`https://api.github.com/repos/adam-cyclones/didi/issues/${issueID}/labels`);
  const body = await res.json();
  const updateTypes = body.map((label) => {
    return mapUpdateType(label.name);
  }).filter(Boolean);

  if (updateTypes.length) {
    // write the semver update type for yarn version {type} - file should be __generated__ on checkout hook.
    return updateTypes;
  } else {
    throw new Error(`Issues cannot be checked out without a label: #${issueID} with either a 'bug' or 'enhancement' of 'structural enhancement' label. checkout has been canceled.`);
  }
};