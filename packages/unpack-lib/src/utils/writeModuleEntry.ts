import { promises } from 'fs';
import { resolve, basename } from "path";
import { tscESM } from './toESM';

const {
  writeFile,
} = promises;

export const writeModuleEntry = async (
  target
): Promise<string> => {
  await writeFile(
    target.output.main,
    await tscESM(target.main, {}),
    'utf-8'
  );
  return target.output.filename;
}