import ts = require("typescript");

export type DidiCompilerOptions = Omit<
  ts.CreateProgramOptions['options'],
  'module' |
  'moduleResolution'
  >

export interface IDidiInterfaceArgs {
  commonJSProjectDir: string;
  profile: 'development' | 'production'
  options: {
    compilerOptions: DidiCompilerOptions,
    polyfillImportMap: boolean,
    importMapJson?: string
  }
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

export type ErrorCode = number;

export type NodeDependencyTypes = Array<'dependencies' | 'devDependencies'>;