import * as mkdirp from 'mkdirp';
import { promises } from 'fs';

const {
  lstat,
} = promises;

export const mkdirESModules = async (path: string) => {
  try {
    (await lstat(path)).isDirectory();
  } catch (e) {
    await mkdirp.default(path);
  }
};