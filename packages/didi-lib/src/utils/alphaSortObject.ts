/**
 * @description alpha sort an object by keys.
 * @param object
 * */
export const alphaSortObject = (object: object) => {
  const ordered = {};
  const sortedKeys = Object.keys(object).sort();
  for (const key of sortedKeys) {
    ordered[key] = object[key];
  }
  return ordered;
};