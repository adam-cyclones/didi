import { transpileToESModule } from 'unpack-lib/src/lib-unpack';

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
@description('A basic program')
@usage('--help')
export class UnpackCLIProgram {
  constructor() {}

  @option('--env <env>')
  env: string | null = null;


  run(@requiredArg('message') message) {
    console.log(`Message: ${message}`);
  }

  @command()
  @commandOption('--reverse')
  print(
    this: Command,
    @requiredArg('first') first,
    @optionalArg('last') last,
    @variadicArg('credentials') credentials
  ) {
    if (this.reverse) {
      console.log(`Name: ${last}, ${first}, ${credentials.join(', ')}`);
    } else {
      console.log(`Name: ${first} ${last}, ${credentials.join(', ')}`);
    }
  }
}

const p = new UnpackCLIProgram();