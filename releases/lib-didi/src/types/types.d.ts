import ts = require('typescript');
export declare type DidiCompilerOptions = Omit<ts.CreateProgramOptions['options'], 'module' | 'moduleResolution'>;
export interface IDidiInterfaceArgs {
    commonJSProjectDir: string;
    profile: 'development' | 'production';
    options: {
        compilerOptions: DidiCompilerOptions;
        polyfillImportMap: boolean;
        importMapJson?: string;
    };
}
export interface ITemplateHTMLIndexArgs {
    title: string;
    description: string;
    lang: string;
    polyfillImportMap: boolean;
    noScriptMessage: string;
    importMapUrl: string;
    importMapInlineContent?: string;
    scriptModuleUrl: string;
    polyFillScriptUrl: string;
}
export declare type ErrorCode = number;
export declare type NodeDependencyTypes = Array<'dependencies' | 'devDependencies'>;
