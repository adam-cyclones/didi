import {basename, resolve} from "path";

export const flattenDepsTree = (roots, targetBasedir, outDir) => {
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