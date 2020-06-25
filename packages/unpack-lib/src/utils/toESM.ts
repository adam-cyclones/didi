import {ModuleKind, transpileModule} from "typescript";
import {cjsToEsm} from "@wessberg/cjs-to-esm-transformer";
import {promises} from "fs";

const {
  readFile
} = promises;

export const tscESM = async (path, target) => {
  let tscResult;
  const content = await readFile(path, 'utf8');
  try {
    tscResult = transpileModule(content, {
      transformers: cjsToEsm(),
      compilerOptions: {
        module: ModuleKind.ESNext,
      }
    });
  } catch (e) {
    target.skipped = true;
    console.warn('\n[Warning] skipping a module, unable to transpile ESM!', path, `
This could be caused by a multiple left-hand assignment require call which causes cjsToEsm to panic.
- Issue: https://github.com/wessberg/cjs-to-esm-transformer/issues/6
- Try installing the latest version of this library: '${path}' as a dependency of your project.
        `);
    return '';
  }
  if (tscResult.outputText) {
    return tscResult.outputText;
  } else {
    return "";
  }
}