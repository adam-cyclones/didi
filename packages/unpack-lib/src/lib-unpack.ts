import { resolve, basename } from 'path';
import resolveTree = require('resolve-tree');
import { ErrorCode, IUnpackInterfaceArgs } from './types/types';
import { UnpackCompilerPanic } from "./utils/errors/UnpackCompilerPanic";
import { tscESM } from './utils/toESM';
import { removeCore } from "./utils/removeCoreModules";
import { mkdirESModules } from "./utils/mkdirESModules";
import { writeESModule } from "./utils/writeESModule";
import { writeImportMap } from "./utils/writeImportMap";
import {isCoreModule} from "./utils/isCoreModule";

const sortObject = (obj: object) => {
    const ordered = {};
    Object.keys(obj).sort().forEach((key) => {
        ordered[key] = obj[key];
    });
    return ordered;
};

export const transpileToESModule = async ({
  cjmTergetBaseDir,
  profile,
  options
}: IUnpackInterfaceArgs): Promise<ErrorCode> => {
    process.chdir(cjmTergetBaseDir);

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

        const flat = resolveTree.flatten(roots);

        const withOutput = flat.map(dependency => {
            return {
                name: dependency.name,
                isUnpackTarget: dependency.root === cjmTergetBaseDir,
                main: require.resolve(dependency.root),
                isCore: isCoreModule(dependency.name),
                output: {
                    main: resolve(
                      OUT_DIR,
                      dependency.name,
                      dependency.version || '*',
                      require.resolve(dependency.root).replace(dependency.root + '/', '') ),
                    version: dependency.version,
                    get dir() {
                        return resolve(this.main, '../');
                    },
                    get filename() {
                        return basename(this.main).replace('.j','.mj');
                    }
                }
            }
        });

        const moduleList = removeCore(withOutput);

        // // all modules that are not node core and potentially used are listed in the targets flat tree
        // // it is hard to tell what is actually used without a runtime check :(
        await mkdirESModules(OUT_DIR);
        const importMap = {
            imports: {},
            scopes: {}
        };
        for (const target of moduleList) {
            if (target.isUnpackTarget) {
                console.log(target)
                // const esmContent = await tscESM(target.resolve);
            } else {
                const esmContent = await tscESM(target.main, target);
                if (esmContent) {
                    await writeESModule(target.output.dir, target.output.filename, esmContent);
                } else if (!target.skipped) {
                    // Unpack didnt catch this error
                    throw new UnpackCompilerPanic('Received no input to transpile.');
                }
            }
            importMap.imports[`${target.name}@${target.output.version}`] = `/${target.name}/${target.output.version}/${target.output.filename}`;
        }

        // Sort
        importMap.imports = sortObject(importMap.imports);
        importMap.scopes = sortObject(importMap.scopes);

        await writeImportMap(OUT_DIR, JSON.stringify(importMap, null, 4));
        // tree shake via runtime in headless browser
    });
    return SUCCESS;
}
