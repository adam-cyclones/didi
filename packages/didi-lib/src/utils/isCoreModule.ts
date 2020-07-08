// eslint-disable-next-line @typescript-eslint/no-var-requires
const coreLibs = require('repl')._builtinLibs;
const extraBlacklist = [
  'util',
];

export const isCoreModule = (name: string): boolean => {
  return [
    ...extraBlacklist,
    ...coreLibs,
  ].includes(name);
};