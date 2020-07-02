import ts = require("typescript");

export type UnpackCompilerOptions = Omit<
  ts.CreateProgramOptions['options'],
  'module' |
  'moduleResolution'
  >

export interface IUnpackInterfaceArgs {
  cjmTergetBaseDir: string;
  profile: 'development' | 'production'
  options: {
    compilerOptions: UnpackCompilerOptions,
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