import { DidiCompilerPanic } from '../../utils/errors/DidiCompilerPanic';
import { ILibDidiContext } from '../../types/machine.types';
import { basename, relative, resolve, sep } from 'path';
import { isCoreModule } from '../../utils/isCoreModule';
import { removeCore } from '../../utils/removeCoreModules';
import { toExtMJS } from '../../utils/toExtMJS';

/**
 * @description Remap found dependencies with new output destination information.
 * @returns {Promise<<object[]>>}
 * */
export const mappingOutputService = async ({ commonJSProjectDir }, context: ILibDidiContext) => {

  const withOutput = context.foundDependencies.map(dependency => {
    return {
      name: dependency.name,
      isDidiTarget: dependency.root === commonJSProjectDir,
      main: require.resolve(dependency.root),
      isCore: isCoreModule(dependency.name),
      output: {
        main: resolve(
          context.constants.MODULE_OUT_DIR,
          dependency.name,
          dependency.version || '*',
          require.resolve(dependency.root).replace(dependency.root + '/', ''),
        ),
        version: dependency.version,
        get dir() {
          return resolve(this.main, '../');
        },
        get filename() {
          return basename(this.main).replace('.j','.mj');
        },
      },
      get importMapImportRecord () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        // conditional key and value depending on if this is the entry file
        if (self.output && typeof self.output.main === 'string' && dependency.version) {
          return {
            [self.isDidiTarget ? '_' : self.name]: self.isDidiTarget ?
              `${sep}${relative(`${commonJSProjectDir}${sep}${dependency.version}`, toExtMJS(self.output.main))}` :
              `${sep}${relative(resolve(context.constants.MODULE_OUT_DIR, '../'), toExtMJS(self.output.main))}`,
          };
        } else {
          throw new DidiCompilerPanic('An internal error occurred during creation of an import record');
        }
      },
      get importMapScopeRecord () {
        return {};
      },
    };
  });

  return removeCore(withOutput);
};
