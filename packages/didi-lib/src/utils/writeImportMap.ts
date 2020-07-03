import { promises } from 'fs';
import {resolve} from "path";

const {
  writeFile
} = promises;

export const writeImportMap = async (path: string, content: string = '{}'): Promise<string> => {
  await writeFile(
    resolve(path, 'didi.importmap'),
    content,
    'utf-8'
  );
  return content;
}