import resolveTree = require('resolve-tree');
import { DidiCompilerPanic } from '../../utils/errors/DidiCompilerPanic';
import { NodeDependencyTypes } from '../../types/types';

/**
 * @description discover all dependencies of a given project by path, excludes dev-dependencies.
 * @returns {Promise<<object[]>>}
 * */
export const searchForDependenciesService = async ({ commonJSProjectDir }, ..._args: any) => {
  // resolveTree requirements
  const lookups: NodeDependencyTypes = ['dependencies'];
  const resolveTreeOpts = {
    basedir: commonJSProjectDir,
    lookups,
  };

  return new Promise((resolve, reject) => {
    resolveTree.packages([commonJSProjectDir], resolveTreeOpts, async (err, roots) => {
      if (err) {
        reject(new DidiCompilerPanic(err));
      }
      resolve(resolveTree.flatten(roots));
    });
  });
};
