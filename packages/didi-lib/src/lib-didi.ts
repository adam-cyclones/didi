
import { resolve} from 'path';
import { Machine, interpret, assign, Interpreter } from 'xstate';

import { IDidiInterfaceArgs } from './types/types';
import { ILibDidiContext, ILibDidiSchema } from './types/machine.types';

import { esModule } from './services/writing/esModule';
import { esModuleIndex } from './services/writing/esModuleIndex';
import { esModuleShim } from './services/writing/esModuleShim';
import { importMap } from './services/writing/importMap';
import { indexHTML } from './services/writing/indexHTML';
import { mappingOutputService } from './services/discoveringDependencies/mappingOutputService';
import { searchForDependenciesService } from './services/discoveringDependencies/searchForDependenciesService';


export const transpileToESModule = ({
  commonJSProjectDir,
  profile,
  options
}: IDidiInterfaceArgs): Interpreter<ILibDidiContext> => {
    process.chdir(commonJSProjectDir);

    const DEVELOPMENT = (profile || 'development') === 'development';
    const DIST_DIR_NAME = 'target';
    const OUT_DIR_NAME = 'es_modules';

    const didiBuildMachine = Machine<ILibDidiContext, ILibDidiSchema, any>({
        id: 'lib-didi-build-steps',
        initial: 'discoveringDependencies',
        context: {
            constants: {
                MODULE_OUT_DIR: resolve(commonJSProjectDir, DIST_DIR_NAME, 'es2015', DEVELOPMENT ? 'debug': 'release', OUT_DIR_NAME),
                get MODULE_OUT_ROOT () {
                    return resolve(this.MODULE_OUT_DIR, '../');
                }
            },
            foundDependencies: [],
            importMap: {
                imports: {},
                scopes: {}
            },
            processedModuleCount: 0,
        },
        states: {
            'discoveringDependencies': {
                initial: 'searching',
                states: {
                    'searching': {
                        invoke: {
                            id: 'search',
                            src: (...xstateArgs) => searchForDependenciesService({ commonJSProjectDir }, xstateArgs),
                            onDone:{
                                target: 'mappingOutput',
                                actions: assign({ foundDependencies: (context, event) => event.data })
                            },
                            onError: {
                                target: '#resultSteps.fail'
                            }
                        },
                    },
                    'mappingOutput': {
                        invoke: {
                            id: 'mapOutput',
                            src: (...xstateArgs) => mappingOutputService({ commonJSProjectDir }, xstateArgs[0]),
                            onDone:{
                                target: '#writeSteps',
                                actions: assign({ foundDependencies: (context, event) => event.data })
                            },
                            onError: {
                                target: '#resultSteps.fail'
                            },
                        },
                    }
                },
            },
            'writing': {
                id: 'writeSteps',
                initial: 'ESModule',
                states: {
                    'ESModule': {
                        invoke: {
                            src: (...xstateArgs) => esModule({ commonJSProjectDir }, xstateArgs[0].foundDependencies[xstateArgs[0].processedModuleCount]),
                            onDone: [
                                {
                                    target: '#writeSteps.ImportMap',
                                    cond: (context) => {
                                        return context.processedModuleCount === context.foundDependencies.length;
                                    }
                                },
                                {
                                    target: '#writeSteps.ESModule',
                                    actions: assign({ processedModuleCount: (context, event) => context.processedModuleCount += 1 }),
                                }
                            ],
                            onError: [
                                {
                                    target: '#writeSteps.ESModuleIndex',
                                    cond: (context, event) => {
                                        return event.data.name === 'DidiPermissibleError';
                                    }
                                },
                                {
                                    target: '#resultSteps.fail'
                                }
                            ],
                        }
                    },
                    'ESModuleIndex': {
                        invoke: {
                            src: (...xstateArgs) => esModuleIndex({
                                moduleOutRoot: xstateArgs[0].constants.MODULE_OUT_ROOT,
                                currentDependency: xstateArgs[0].foundDependencies[xstateArgs[0].processedModuleCount]
                            }),
                            onDone: [
                                {
                                    target: '#writeSteps.ESModule',
                                    actions: assign({ processedModuleCount: (context) => context.processedModuleCount += 1 }),
                                    cond: (context) => {
                                        return context.processedModuleCount !== context.foundDependencies.length;
                                    }
                                },
                                {
                                    target: '#writeSteps.ImportMap',
                                    cond: (context) => {
                                        return context.processedModuleCount === context.foundDependencies.length;
                                    }
                                },
                                {
                                    target: '#resultSteps.fail'
                                }
                            ],
                            onError: {
                                target: '#resultSteps.fail'
                            },
                        }
                    },
                    'ImportMap': {
                        invoke: {
                            src: (...xstateArgs) => importMap({ commonJSProjectDir, options }, {
                                dependencies: xstateArgs[0].foundDependencies,
                                importMap: xstateArgs[0].importMap,
                                constants: xstateArgs[0].constants,
                            }),
                            onDone: {
                                target: '#writeSteps.ESModuleShim',
                                actions: assign({ importMap: (context, event) => event.data })
                            },
                            onError: {
                                target: '#resultSteps.fail'
                            }
                        }
                    },
                    'ESModuleShim': {
                        invoke: {
                            src: (...xstateArgs) => esModuleShim({ moduleOutRoot: xstateArgs[0].constants.MODULE_OUT_ROOT }),
                            onDone: {
                                target: '#writeSteps.IndexHtml'
                            },
                            onError: {
                                target: '#resultSteps.fail'
                            }
                        }
                    },
                    'IndexHtml': {
                        invoke: {
                            src: (...xStateArgs) => indexHTML({ options }, {
                                importMap: xStateArgs[0].importMap,
                                constants: xStateArgs[0].constants
                            }),
                            onDone: {
                                target: '#resultSteps'
                            },
                            onError: {
                                target: '#resultSteps.fail'
                            }
                        }
                    },
                },
            },
            'result': {
                id:'resultSteps',
                initial: 'success',
                states: {
                    'fail': {
                        type: 'final'
                    },
                    'success': {
                        type: 'final'
                    }
                }
            }
        }
    });

    const libDidiInstance = interpret(didiBuildMachine);

    libDidiInstance.start();

    return libDidiInstance;
}
