import { IDidiImportMap } from '../types/machine.types';

/**
 * @description alpha sort an object by keys.
 * @param object
 * */
export const alphaSortObject = (object: Record<string, never> | IDidiImportMap) => {
  const ordered = {};
  const sortedKeys = Object.keys(object).sort();
  for (const key of sortedKeys) {
    ordered[key] = object[key];
  }
  return ordered;
};