import { promises } from 'fs';
import {resolve} from "path";
import { generateHtmlIndex } from '../glue/generate-html-index';
import {ITemplateHTMLIndexArgs} from "../types/types";

const {
  writeFile
} = promises;

export const writeIndexHTML = async (path: string, options: Partial<ITemplateHTMLIndexArgs> = {}): Promise<void> => {
  await writeFile(
    resolve(path, 'index.html'),
    await generateHtmlIndex({
      title: 'Unpack, great success!',
      description: 'An unpack managed project',
      lang: 'en',
      polyfillImportMap: true,
      noScriptMessage: 'You need to enable JavaScript to use this application.',
      importMapUrl: 'unpack.importmap',
      scriptModuleUrl: 'mod.js',
      polyFillScriptUrl: '',
      ...options
    }),
    'utf-8'
  );
}