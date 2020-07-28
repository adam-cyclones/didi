import { IDidiTreeDependency, ILibDidiContext } from '../../types/machine.types';
interface IimportMapArgs {
    dependencies: IDidiTreeDependency[];
    importMap: ILibDidiContext['importMap'];
    constants: ILibDidiContext['constants'];
}
export declare const importMap: ({ commonJSProjectDir, options }: {
    commonJSProjectDir: any;
    options: any;
}, { dependencies, importMap, constants }: IimportMapArgs) => Promise<{}>;
export {};
