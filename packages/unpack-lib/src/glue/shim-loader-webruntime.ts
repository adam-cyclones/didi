import { resolve } from 'path';
import { promises } from 'fs';
const {
  readFile,
  writeFile
} = promises;


export const shimLoaderWebruntime = async ({
  polyfillImportMap,
  polyFillScriptUrl,
  OUT_DIR
}: {
  polyfillImportMap: boolean,
  polyFillScriptUrl: string,
  OUT_DIR: string
}) => {
  if ( polyfillImportMap ) {
    const wrtLoader = await readFile(
      resolve(
        __dirname,
        `../../../../../../../node_modules/es-module-shims/dist/${polyFillScriptUrl}`
      ),
      'utf8'
    );
    await writeFile(resolve(OUT_DIR, polyFillScriptUrl), wrtLoader, 'utf8');
    console.log('Import Map polyfill enabled and wrote.', resolve(OUT_DIR, 'es-module-shims.min.js'));
  }
}