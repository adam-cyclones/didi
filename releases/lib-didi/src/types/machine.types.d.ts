import { InvokeCreator, StateSchema } from 'xstate';
import { InvokedPromiseOptions } from 'xstate/lib/invoke';
export declare type IdidiBuildStepInvokedPromise = InvokeCreator<ILibDidiContext, any>;
export interface IdidiBuildStep extends StateSchema<ILibDidiSchema> {
    invoke: InvokedPromiseOptions;
}
export interface ILibDidiSchema {
    states: {
        discoveringDependencies: {
            states: {
                searching: IdidiBuildStep;
                mappingOutput: IdidiBuildStep;
            };
        };
        writing: {
            states: {
                ESModule: IdidiBuildStep;
                ImportMap: IdidiBuildStep;
                IndexHtml: IdidiBuildStep;
                ESModuleIndex: IdidiBuildStep;
                ESModuleShim: IdidiBuildStep;
            };
        };
        result: {
            states: {
                fail: IdidiBuildStep;
                success: IdidiBuildStep;
            };
        };
    };
}
export interface IDidiTreeDependency {
    name: string;
    root: string;
    main: string;
    version: string;
    isDidiTarget?: boolean;
    isCore?: boolean;
    skipped?: boolean;
    output?: {
        main: string;
        version: string;
        dir: string;
        filename: string;
    };
    importMapImportRecord: {
        [k: string]: string;
    };
    importMapScopeRecord: {
        [k: string]: string;
    };
}
export interface IDidiImportMap {
    imports: Record<string, unknown>;
    scopes: Record<string, unknown>;
}
export interface ILibDidiContext {
    processedModuleCount: number;
    constants: {
        MODULE_OUT_DIR: string;
        MODULE_OUT_ROOT: ModuleOutRootPath;
    };
    foundDependencies: Array<IDidiTreeDependency>;
    importMap: IDidiImportMap;
}
export declare type ModuleOutRootPath = string;
