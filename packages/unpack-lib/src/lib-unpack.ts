import { resolve } from 'path';
import resolveTree = require('resolve-tree');
import { ErrorCode, IUnpackInterfaceArgs } from './types/types';
import { UnpackCompilerPanic } from "./utils/errors/UnpackCompilerPanic";
import { flattenDepsTree } from './utils/flattenTreeDeps';
import { tscESM } from './utils/toESM';
import { removeDuplicates } from "./utils/removeDuplicates";
import { removeCore } from "./utils/removeCoreModules";
import { mkdirESModules } from "./utils/mkdirESModules";
import { writeESModule } from "./utils/writeESModule";

export const transpileToESModule = async ({
  cjmTergetBaseDir,
  profile,
  options
}: IUnpackInterfaceArgs): Promise<ErrorCode> => {

    const SUCCESS = 0;
    const DEVELOPMENT = true;
    const DIST_NAME = 'target';
    const OUT_DIR_NAME = 'es_modules';
    const OUT_DIR: string = resolve(cjmTergetBaseDir, DIST_NAME, 'es2015', DEVELOPMENT ? 'debug': 'release', OUT_DIR_NAME);
    const lookups: Array<'dependencies' | 'devDependencies'> = [
      'dependencies'
    ];

    const resolveTreeOpts = {
        basedir: cjmTergetBaseDir,
        lookups
    }
    resolveTree.packages([cjmTergetBaseDir], resolveTreeOpts, async (err, roots) => {
        if (err) {
            throw new UnpackCompilerPanic(err)
        }
        // get a flat dep tree
        const targets = removeCore(
          removeDuplicates(
            flattenDepsTree(
              roots,
              cjmTergetBaseDir,
              OUT_DIR,
            ),
          ),
        );
        // all modules that are not node core and potentially used are listed in the targets flat tree
        // it is hard to tell what is actually used without a runtime check :(
        await mkdirESModules(OUT_DIR);
        for (const target of targets) {
            if (target.resolve === '.') {
                // const esmContent = await tscESM(target.resolve);
            } else {
                const esmContent = await tscESM(target.resolve);
                if (esmContent) {
                    await writeESModule(target.output.dirname, target.output.filename, esmContent);
                } else {
                    throw new UnpackCompilerPanic('Received no input to transpile.');
                }
            }
        }
        // tree shake via runtime in headless browser
    });
    return SUCCESS;
}
