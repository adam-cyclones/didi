#!/usr/bin/env node

/**
 * @file @didi-js/client-didi-cli module main file.
 * @description A CLI client for lib-didi. didi is a bundle-less runtime for JavaScript and Typescript, it transpiles common.js modules into distinct ESmodules.
 * @copyright Copyright © 2020 Adam Crockett under MIT License (MIT)
 * @author Adam Crockett

 **/

import chalk from 'chalk';
import { resolve } from 'path';
import { transpileToESModule } from '@didi-js/lib-didi';
import { devServer } from '@didi-js/lib-didi-dev-server';

import {
  Command,
  command,
  commandOption,
  description,
  option,
  optionalArg,
  program,
  requiredArg,
  usage,
  version,
} from 'commander-ts';

@program()
@version('1.0.0') // TODO: use manifest version
@description('Convert a project from common JS to ESmodules, with included bundler-like / task runner behaviour.')
@usage('--help')
export class DidiCLIProgram {

  @option('--env <env>')
  env: string | null = null;

  @command()
  @commandOption('--profile', '<development | production> production produces an optimized build. (defaults: development)')
  @commandOption('--polyfillImportMap', 'Until Import Maps stabilize')
  async run(
    this: Command,
    // Required
    @requiredArg('transpileToESModule') path: string,
    // Optional
    @optionalArg('polyfillImportMap') polyfillImportMap: boolean,
  ) {
    // Defaults
    if (!polyfillImportMap) {
      polyfillImportMap = true;
    }

    if (path) {
      const commonJSProjectDir: string = resolve(process.cwd(), path);
      const LibDiDiMachine = await transpileToESModule({
        profile: 'development',
        options: {
          compilerOptions: {},
          polyfillImportMap: polyfillImportMap,
        },
        commonJSProjectDir,
      });

      LibDiDiMachine.onTransition(async (transition) => {
        const moduleWasWrote = transition.context.foundDependencies[transition.context.processedModuleCount];
        const [stage, doing] = Object.entries(transition.value)[0];
        switch (doing) {
        case 'success':
          console.log(`didi output ${transition.context.processedModuleCount} ES Modules`);

          await devServer({
            verbose: true,
            root: transition.context.constants.MODULE_OUT_ROOT,
            host: '127.0.0.1',
            index: 'index.html',
            port: 8086,
          });

          break;
        case 'fail':
          console.log(transition.event.type, '\n', transition.event);
          break;
        default:
          // Follow LibDidiMachine whilst writing es modules sequentially
          if (moduleWasWrote?.name && !moduleWasWrote?.isDidiTarget) {
            console.log(chalk `── {white ${stage}:} {green ✔ ${moduleWasWrote?.name}}`);
          } else {
            if (doing === 'ESModule') {
            // skip
            } else {
              console.log(chalk `── {white ${stage}:} {green ✔ ${doing}}`);
            }
          }
          break;
        }
      });
    } else {
      console.log('The "path" argument must be of type string. Received no input.');
    }
  }
}

new DidiCLIProgram();