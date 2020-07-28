import { Interpreter } from 'xstate';
import { IDidiInterfaceArgs } from './types/types';
import { ILibDidiContext } from './types/machine.types';
export declare const transpileToESModule: ({ commonJSProjectDir, profile, options, }: IDidiInterfaceArgs) => Interpreter<ILibDidiContext>;
