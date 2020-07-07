import {InvokeCreator, StateSchema} from "xstate";
import { InvokedPromiseOptions } from "xstate/lib/invoke";

/**
 * @description gives context to a didi build invoked promise
 * */
export type IdidiBuildStepInvokedPromise = InvokeCreator<ILibDidiContext, any>;

/**
 * @description didi build steps only invoke, they have no listeners
 * */
export interface IdidiBuildStep extends StateSchema<ILibDidiSchema>{
  invoke: InvokedPromiseOptions
}

/**
 * @description Defines the build process
 * */
export interface ILibDidiSchema {
  states: {
    discoveringDependencies: {
      states: {
        searching: IdidiBuildStep;
        mappingOutput: IdidiBuildStep;
      }
    };
    writing: {
      states: {
        ESModule: IdidiBuildStep;
        ImportMap: IdidiBuildStep;
        IndexHtml: IdidiBuildStep;
        ESModuleIndex: IdidiBuildStep;
        ESModuleShim: IdidiBuildStep;
      }
    };
    result: {
      states: {
        fail: IdidiBuildStep,
        success: IdidiBuildStep
      }
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
  },
  importMapImportRecord: {
    [k: string]: string
  },
  importMapScopeRecord: {
    [k: string]: string
  }
}

interface IDidiImportMap {
  imports: object;
  scopes: object;
}

/**
 * @description The extended state of didi during builds
 * */
export interface ILibDidiContext {
  processedModuleCount: number;
  constants: {
    MODULE_OUT_DIR: string;
    MODULE_OUT_ROOT: ModuleOutRootPath;
  },
  foundDependencies: Array<IDidiTreeDependency>;
  importMap: IDidiImportMap;
}

export type ModuleOutRootPath = string;