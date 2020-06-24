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
export class Program {
  @option('--env <env>')
  env: string = null;

  constructor() {}

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

const p = new Program();