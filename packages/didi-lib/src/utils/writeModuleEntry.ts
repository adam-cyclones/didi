import { promises } from 'fs';
import { tscESM } from './toESM';
import { IDidiTreeDependency } from '../types/machine.types';

const {
  writeFile,
} = promises;

export const writeModuleEntry = async (
  target :IDidiTreeDependency,
): Promise<string> => {
  await writeFile(
    target.output.main,
    await tscESM(target.main, {}),
    'utf-8',
  );
  return target.output.filename;
};
