import { mkdirESModules } from './mkdirESModules';
import { promises } from 'fs';
import { resolve } from 'path';

const {
  writeFile,
} = promises;

export const writeESModule = async (path, filename, content) => {
  await mkdirESModules(path);
  await writeFile(
    resolve(path, filename),
    content,
    'utf-8',
  );
};