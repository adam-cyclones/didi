import {ILibDidiContext } from '../../types/machine.types';
import { promises } from "fs";
import { DidiCompilerPanic } from "../../utils/errors/DidiCompilerPanic";
import { generateHtmlIndex } from "../../glue/generate-html-index";
import { resolve } from "path";

const {
  writeFile
} = promises;

/**
 * @description write index.html template.
 * @param moduleOutDir The root of didi output
 * @param importMap
 * @param constants string values held in machine context
 * @returns Promise<void>
 * */
export const indexHTML = async ({ options }, { importMap, constants }: Partial<ILibDidiContext>) => {
  try {
    const htmlIndexContent = await generateHtmlIndex({
        lang: 'en',
        title: 'didi roars!',
        polyfillImportMap: true,
        description: 'Its a generated template, didi says you can change it.',
        importMapUrl: 'didi.importmap',
        noScriptMessage: 'You must enable JavaScript to use this application.',
        scriptModuleUrl: '_',
        polyFillScriptUrl: './es-module-shims.min.js',
        // If shimmed, we need to inline the import map
        importMapInlineContent: JSON.stringify(importMap, null, 2),
    });
    await writeFile(resolve((constants as ILibDidiContext['constants']).MODULE_OUT_ROOT, 'index.html'), htmlIndexContent, 'utf8');
  } catch (e) {
    throw new DidiCompilerPanic('Could not write index.html');
  }
};

