import { transpileToESModule } from '../../unpack-lib/src/lib-unpack';
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
export class UnpackCLIProgram {
  constructor() {}

  @option('--env <env>')
  env: string | null = null;

  @command()
  @commandOption('--profile', `<development | production> production produces an optimized build. (defaults: development)`)
  async run(this: Command, @requiredArg('transpileToESModule') path: string) {
    if (path) {
      const status = await transpileToESModule({
        profile: 'development',
        options: {
          compilerOptions: {}
        },
        cjmTergetBaseDir: resolve(process.cwd(), path)
      });
      if (status === 0) {
        console.log('Process ended with exit code 0.')
      }
    } else {
      console.log('The "path" argument must be of type string. Received no input.')
    }
  }
}

const p = new UnpackCLIProgram();