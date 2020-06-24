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

export type ErrorCode = number;