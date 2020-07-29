import { IDidiTreeDependency, ILibDidiContext } from '../../types/machine.types';
import { writeImportMap } from '../../utils/writeImportMap';
import { alphaSortObject } from '../../utils/alphaSortObject';

interface IimportMapArgs {
  dependencies: IDidiTreeDependency[],
  importMap: ILibDidiContext['importMap'],
  constants: ILibDidiContext['constants']
}

/**
 * @description write an import map to allow base specifiers resolve.
 * @param dependencies all found dependencies
 * @param options passed by client
 * @param importMap
 * @param constants
 * @param commonJSProjectDir where to find the project didi is transpiling
 * */
export const importMap = async ({ commonJSProjectDir, options }, { dependencies, importMap, constants }: IimportMapArgs) => {
  const importMapRecords = dependencies.map((dependency) => {
    if (dependency.skipped) {
      return null;
    } else {

      return {
        imports: dependency.importMapImportRecord,
        scopes: dependency.importMapScopeRecord,
      };
    }
  })
    // ignore skipped - (caused parse issue - handled later)
    .filter(Boolean);

  for (const record of importMapRecords) {
    if (record && record.imports && record.scopes) {
      Object.assign(importMap.imports, record.imports);
      Object.assign(importMap.scopes, record.scopes);
    }
  }
  const alphaSortOutput = alphaSortObject(importMap);
  // when polyfill is on, do not write a file, instead inline in html later.
  if (!options.polyfillImportMap) {
    await writeImportMap(constants.MODULE_OUT_ROOT, JSON.stringify(alphaSortOutput, null, 4));
  }
  return alphaSortOutput;
};

