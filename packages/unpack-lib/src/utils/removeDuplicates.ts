export const removeDuplicates = (originalArray) => {
  const newArray = [];
  const lookupObject  = {};
  for (const index in originalArray) {
    lookupObject[originalArray[index]['name']] = originalArray[index];
  }
  for(const index in lookupObject) {
    // @ts-ignore
    newArray.push(lookupObject[index]);
  }
  return newArray;
}