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
    compilerOptions: UnpackCompilerOptions
  }
}

export interface ITemplateHTMLIndexArgs {
  title: string;
  description: string;
  lang: string;
  polyfillImportMap: boolean;
  noScriptMessage: string;
  importMapUrl: string;
  scriptModuleUrl: string;
  polyFillScriptUrl: string;
}

export type ErrorCode = number;