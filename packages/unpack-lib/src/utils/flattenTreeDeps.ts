import {basename, resolve} from "path";
import { isCoreModule } from './isCoreModule';

const toModuleExtname = (file: string): string => {
  return file.replace('.j','.mj')
}


export const flattenDepsTree = (roots, targetBasedir, outDir) => {
  process.chdir(targetBasedir);
  const resolveFrom = { paths: [process.cwd()] };

  return roots.reduce((acc, r) => {
    if(r.dependencies && r.dependencies.length) {
      acc = acc.concat([r.meta], flattenDepsTree(r.dependencies, targetBasedir, outDir));
    } else {
      acc.push(r);
    }
    return acc;
  }, [])
    // get only the info required
    .map(({
      name,
      basedir,
      main,
      root,
      manifest
    }) => {

      if (!root) {
        console.log(name, basedir, main, root, manifest)
      }
      return ({
        basedir,
        isCore: isCoreModule(name),
        name,
        output: {
          dirname: resolve(outDir, name),
          basename: basename(name),
          filename: toModuleExtname(basename(require.resolve(name, resolveFrom))),
        },
        resolve: name === basename(targetBasedir) ?
          name :
          require.resolve(name, resolveFrom),
      })
    }
  )
}