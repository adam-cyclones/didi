import { IDevServerArgs } from './types/types';
export declare const devServer: ({ host, index, https, port, reload, root, verbose, }: Partial<IDevServerArgs>) => Promise<void>;
