/**
 * @description transform .js extensions to .mjs
 * @param pathWithExtension a string of path or file containing a .js extension
 * */
export const toExtMJS = (pathWithExtension: string): string => {
  if (pathWithExtension.endsWith('.js')) {
    return pathWithExtension.replace('.j', '.mj');
  } else {
    return pathWithExtension;
  }
}