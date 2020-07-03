import { mkdirESModules } from "./mkdirESModules";
import { resolve } from "path";
import { promises } from "fs";

const {
  writeFile
} = promises;

export const writeESModule = async (path, filename, content) => {
  await mkdirESModules(path);
  await writeFile(
    resolve(path, filename),
    content,
    'utf-8'
  );
}