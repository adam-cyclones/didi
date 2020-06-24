const coreLibs = require('repl')._builtinLibs;

export const isCoreModule = (name: string) => {
  return coreLibs.includes(name);
}