import { IDidiTreeDependency, ModuleOutRootPath } from '../../types/machine.types';
import { tscESM } from '../../utils/toESM';
import { writeESModule } from '../../utils/writeESModule';
import { DidiCompilerPanic } from '../../utils/errors/DidiCompilerPanic';

/**
 * @description Write the main file aka ES Module entry file.
 * @param currentDependency a single dependency at (I), where I is the next module to process
 * @param commonJSProjectDir where to find the project didi is transpiling
 * @returns Promise<object[]>
 * */
export const esModuleIndex = async ({
  moduleOutRoot,
  currentDependency,
}: {
  moduleOutRoot: ModuleOutRootPath,
  currentDependency: IDidiTreeDependency
}) => {
  if (currentDependency) {
    if (currentDependency.output && currentDependency.isDidiTarget) {
      const esmContent = await tscESM(currentDependency.main, currentDependency);
      if (esmContent) {
        await writeESModule(moduleOutRoot, currentDependency.output.filename, esmContent);
        if (currentDependency.skipped) {
          throw new DidiCompilerPanic('Could not transpile ES Module index!');
        }
      } else if (!currentDependency.skipped) {
        // Didi didnt catch this error
        throw new DidiCompilerPanic('Received no input to transpile ES Module index!');
      }
    } else {
      throw new DidiCompilerPanic('An internal error has occurred whilst mapping dependencies.');
    }
  }
};

