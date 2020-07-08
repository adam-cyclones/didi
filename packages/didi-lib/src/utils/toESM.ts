import { ModuleKind, transpileModule } from 'typescript';
import { cjsToEsm } from '@wessberg/cjs-to-esm-transformer';
import { promises } from 'fs';

const {
  readFile,
} = promises;

export const tscESM = async (path, target) => {
  let tscResult;
  const content = await readFile(path, 'utf8');
  try {
    tscResult = transpileModule(content, {
      transformers: cjsToEsm(),
      compilerOptions: {
        module: ModuleKind.ESNext,
      },
    });
  } catch (e) {
    target.output.skipped = true;
    console.warn('\n[Warning] skipping a module, unable to transpile ESM!', path, `
- Try installing the latest version of this library: '${path}' as a dependency of your project.
`);
    return '';
  }
  if (tscResult.outputText) {
    return tscResult.outputText;
  } else {
    return `throw new Error('didi failed to parse this file.') ${content}`;
  }
};