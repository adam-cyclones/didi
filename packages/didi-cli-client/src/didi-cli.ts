import { transpileToESModule } from '../../didi-lib/src/lib-didi';
import { devServer } from '../../didi-devserver/src/didi-devserver';
import { resolve } from 'path';
import {
  action,
  command,
  commandOption,
  description,
  option,
  optionalArg,
  program,
  requiredArg,
  usage,
  variadicArg,
  version,
  Command
} from 'commander-ts';

@program()
@version('1.0.0')
@description('Convert a project from common JS to ESmodules, with included bundler-like / task runner behaviour.')
@usage('--help')
export class DidiCLIProgram {
  constructor() {}

  @option('--env <env>')
  env: string | null = null;

  @command()
  @commandOption('--profile', `<development | production> production produces an optimized build. (defaults: development)`)
  @commandOption('--polyfillImportMap', `Until Import Maps stabilize`)
  async run(
    this: Command,
    // Required
    @requiredArg('transpileToESModule') path: string,
    // Optional
    @optionalArg('polyfillImportMap') polyfillImportMap: boolean
  ) {
    // Defaults
    if (!polyfillImportMap) {
      polyfillImportMap = true;
    }

    if (path) {
      const cjmTergetBaseDir: string = resolve(process.cwd(), path);
      const status = await transpileToESModule({
        profile: 'development',
        options: {
          compilerOptions: {},
          polyfillImportMap: polyfillImportMap
        },
        cjmTergetBaseDir
      });

      await devServer({
        verbose: true,
        root: resolve(cjmTergetBaseDir, 'target', 'es2015', 'debug'),
        host: '127.0.0.1',
        index: 'index.html',
        port: 8086,
      });

      console.log('http://localhost:8086');

      if (status === 0) {
        console.log('Process ended with exit code 0.')
      }
    } else {
      console.log('The "path" argument must be of type string. Received no input.')
    }
  }
}

const p = new DidiCLIProgram();