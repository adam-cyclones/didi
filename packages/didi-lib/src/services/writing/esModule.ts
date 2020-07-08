import { IDidiTreeDependency } from '../../types/machine.types';
import { DidiPermissibleError } from '../../utils/errors/DidiPermissibleError';
import { tscESM } from '../../utils/toESM';
import { writeESModule } from '../../utils/writeESModule';
import { DidiCompilerPanic } from '../../utils/errors/DidiCompilerPanic';

/**
 * @description Remap found dependencies with new output destination information.
 * @param currentDependency a single dependency at (I), where I is the next module to process
 * @param commonJSProjectDir where to find the project didi is transpiling
 * @returns Promise<object[]>
 * */
export const esModule = async ({ commonJSProjectDir }, currentDependency: IDidiTreeDependency) => {
  if (currentDependency) {
    if (currentDependency.output) {
      if (currentDependency.isDidiTarget) {
        throw new DidiPermissibleError('Found common js entry, rerouting state.');
      } else {
        const esmContent = await tscESM(currentDependency.main, currentDependency);
        if (esmContent) {
          await writeESModule(currentDependency.output.dir, currentDependency.output.filename, esmContent);
        } else if (!currentDependency.skipped) {
          // Didi didnt catch this error
          throw new DidiCompilerPanic('Received no input to transpile.');
        }
      }
    } else {
      throw new DidiCompilerPanic('An internal error has occurred whilst mapping dependencies.');
    }
  }
};

