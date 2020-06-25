import { promises } from 'fs';
import {resolve} from "path";

const {
  writeFile
} = promises;

export const writeImportMap = async (path: string, content = '{}') => {
  await writeFile(
    resolve(path, 'unpack.importmap'),
    content,
    'utf-8'
  );
}