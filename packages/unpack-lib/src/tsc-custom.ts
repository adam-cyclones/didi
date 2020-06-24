import * as mkdirp from 'mkdirp'
import { ModuleKind, transpileModule } from "typescript";
import { cjsToEsm } from "@wessberg/cjs-to-esm-transformer";
import { promises } from 'fs';
import { resolve, basename } from 'path';
const coreLibs = require('repl')._builtinLibs;
const resolveTree = require('resolve-tree');
import ts = require("typescript");

const {
    readFile,
    writeFile,
    lstat
} = promises;

class UnpackCompilerPanic extends Error {
    constructor(message) {
        super(message);
        this.name = "UnpackCompilerPanic"; // (2)
    }
}

const removeCore = (targetModules) => {
    return targetModules.filter(mod => !mod.isCore)
}

const isCoreModule = (name: string) => {
    return coreLibs.includes(name);
}

const mkdirpWebModules = async (path) => {
    path = resolve(path);
    try {
        ;(await lstat(path)).isDirectory();
    } catch (e) {
        await mkdirp(path);
    }
    return path;
}

const writeImportMap = async (path) => {

}

const writeESModule = async (path, filename, content) => {
    const webModulesPath = await mkdirpWebModules(path);
    await writeFile(resolve(webModulesPath, filename), content, 'utf-8');
}

const tscESM = async (path) => {
    let tscResult;
    const content = await readFile(path, 'utf8');
    try {
        tscResult = transpileModule(content, {
            transformers: cjsToEsm(),
            compilerOptions: {
                module: ModuleKind.ESNext,
            }
        });
    } catch (e) {
        console.warn('\n[Warning] skipping a module, unable to transpile ESM!', path, `
This could be caused by a multiple left-hand assignment require call which causes cjsToEsm to panic.
- Issue: https://github.com/wessberg/cjs-to-esm-transformer/issues/6
- Try installing the latest version of this library: '${path}' as a dependency of your project.
        `);
        return '';
    }
    if (tscResult.outputText) {
        return tscResult.outputText;
    } else {
        return "";
    }
}

const removeDuplicates = (originalArray) => {
    const newArray = [];
    const lookupObject  = {};
    for (const i in originalArray) {
        lookupObject[originalArray[i]['name']] = originalArray[i];
    }
    for(const i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

const flatten = (roots, targetBasedir, outDir) => {
  return roots.reduce((acc, r) => {
      if(r.dependencies && r.dependencies.length) {
          acc = acc.concat([r.meta], flatten(r.dependencies, targetBasedir));
      } else {
          acc.push(r);
      }
      return acc;
  }, [])
    // get only the info required
    .map(({
        name,
        basedir,
        main
  }) => ({
      name,
      isCore: isCoreModule(name),
      basedir,
      resolve: name === basename(targetBasedir) ?
        require.resolve(resolve(process.cwd(), targetBasedir)) :
        require.resolve(name, { paths: [resolve(process.cwd(), targetBasedir)] }),
      output: {
          dirname: resolve(outDir, name),
          basename: basename(name),
          filename: name === basename(targetBasedir) ?
            basename(main).replace('.js', '.mjs') :
            basename(require.resolve(name, { paths: [resolve(process.cwd(), targetBasedir)] })).replace('.js', '.mjs'),
      }
  }))
}

type UnpackCompilerOptions = Omit<
    ts.CreateProgramOptions['options'],
    'module' |
    'moduleResolution'
>

export interface IUnpackInterfaceArgs {
    cjmTergetBaseDir: string;
    profile: 'development' | 'production'
    options: {
        compilerOptions: UnpackCompilerOptions
    }
}

type ErrorCode = number;
export const transpileToESModule = async ({ cjmTergetBaseDir, profile, options }: IUnpackInterfaceArgs): Promise<ErrorCode> => {

    const SUCCESS = 0;
    const DEVELOPMENT = true;
    const DIST_NAME = 'target';
    const OUT_DIR_NAME = 'es_modules';
    const OUT_DIR: string = resolve(cjmTergetBaseDir, DIST_NAME, 'es2015', DEVELOPMENT ? 'debug': 'release', OUT_DIR_NAME);
    const lookups: Array<'dependencies' | 'devDependencies'> = [
      'dependencies'
    ];

    if (cjmTergetBaseDir) {
        const resolveTreeOpts = {
            basedir: cjmTergetBaseDir,
            lookups
        }
        // Packages
        resolveTree.packages([cjmTergetBaseDir], resolveTreeOpts, async (err, roots) => {
            if (err) return console.error(err);
            // get a flat dep tree
            const targets = removeCore(
              removeDuplicates(
                flatten(roots, cjmTergetBaseDir, OUT_DIR),
              ),
            );
            // all modules that are not node core and potentially used are listed in the targets flat tree
            // it is hard to tell what is actually used without a runtime check :(

            await mkdirpWebModules(OUT_DIR);
            for (const target of targets) {
                if (target.resolve === '.') {
                    // const esmContent = await tscESM(target.resolve);
                } else {
                    const esmContent = await tscESM(target.resolve);
                    if (esmContent) {
                        console.log(target.output.dirname)
                        await writeESModule(target.output.dirname, target.output.filename, esmContent);
                        // await writeWebModule(esmPath)
                    }
                }
            }
            // tree shake via runtime in headless browser
        });

        return SUCCESS;
    }
}
