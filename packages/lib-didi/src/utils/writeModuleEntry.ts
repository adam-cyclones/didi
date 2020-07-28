import { promises } from 'fs';
import { tscESM } from './toESM';
import { IDidiTreeDependency } from '../types/machine.types';
import { DidiCompilerPanic } from './errors/DidiCompilerPanic';

const {
  writeFile,
} = promises;

export const writeModuleEntry = async (
  target :IDidiTreeDependency,
): Promise<string> => {
  if (target.output) {
    await writeFile(
      target.output.main,
      await tscESM(target.main, {}),
      'utf-8',
    );
    return target.output.filename;
  } else {
    throw new DidiCompilerPanic('An internal error has occurred whilst mapping dependencies.');
  }
};
