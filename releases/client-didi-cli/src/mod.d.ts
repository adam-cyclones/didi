#!/usr/bin/env node
import { Command } from 'commander-ts';
export declare class DidiCLIProgram {
    env: string | null;
    run(this: Command, path: string, polyfillImportMap: boolean): Promise<void>;
}
