const coreLibs = require('repl')._builtinLibs;
const extraBlacklist = [
  'util'
];

export const isCoreModule = (name: string) => {
  return [
    ...extraBlacklist,
    ...coreLibs
  ].includes(name);
}