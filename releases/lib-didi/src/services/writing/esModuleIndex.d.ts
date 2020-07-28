import { IDidiTreeDependency, ModuleOutRootPath } from '../../types/machine.types';
export declare const esModuleIndex: ({ moduleOutRoot, currentDependency, }: {
    moduleOutRoot: ModuleOutRootPath;
    currentDependency: IDidiTreeDependency;
}) => Promise<void>;
