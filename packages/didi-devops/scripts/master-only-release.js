const { execSync } = require('child_process');
const branchName = execSync('git rev-parse --abbrev-ref HEAD', {encoding: 'utf8'}).trim();
const publishingBranch = 'master';
if (branchName !== publishingBranch) {
  throw new Error(`Cannot perform this operation on branch ${branchName}, please checkout ${publishingBranch} branch.`);
}