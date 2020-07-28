import { ModuleOutRootPath } from '../../types/machine.types';
import { promises } from 'fs';
import { DidiCompilerPanic } from '../../utils/errors/DidiCompilerPanic';
import { basename, sep } from 'path';

const {
  readFile,
  writeFile,
} = promises;

/**
 * @description write ES Module shim.
 * @param moduleOutDir The root of didi output
 * @returns {Promise<<void[]>>}
 * */
export const esModuleShim = async ({ moduleOutRoot }: { moduleOutRoot: ModuleOutRootPath }) => {
  try {
    const pathToMinShim = require.resolve('es-module-shims').replace('.js', '.min.js');
    const nameOutputFile = basename(pathToMinShim);
    const shimContent = await readFile(pathToMinShim, 'utf8');
    await writeFile(`${moduleOutRoot}${sep}${nameOutputFile}`, shimContent, 'utf8');
  } catch (e) {
    throw new DidiCompilerPanic('Could not write ES Modules shim');
  }
};

