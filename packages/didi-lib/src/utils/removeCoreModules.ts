export const removeCore = (targetModules) => {
  return targetModules.filter(mod => !mod.isCore)
}