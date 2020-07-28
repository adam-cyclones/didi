"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpileToESModule = void 0;
const path_1 = require("path");
const xstate_1 = require("xstate");
const esModule_1 = require("./services/writing/esModule");
const esModuleIndex_1 = require("./services/writing/esModuleIndex");
const esModuleShim_1 = require("./services/writing/esModuleShim");
const importMap_1 = require("./services/writing/importMap");
const indexHTML_1 = require("./services/writing/indexHTML");
const mappingOutputService_1 = require("./services/discoveringDependencies/mappingOutputService");
const searchForDependenciesService_1 = require("./services/discoveringDependencies/searchForDependenciesService");
exports.transpileToESModule = ({ commonJSProjectDir, profile, options, }) => {
    process.chdir(commonJSProjectDir);
    const DEVELOPMENT = (profile || 'development') === 'development';
    const DIST_DIR_NAME = 'target';
    const OUT_DIR_NAME = 'es_modules';
    const didiBuildMachine = xstate_1.Machine({
        id: 'lib-didi-build-steps',
        initial: 'discoveringDependencies',
        context: {
            constants: {
                MODULE_OUT_DIR: path_1.resolve(commonJSProjectDir, DIST_DIR_NAME, 'es2015', DEVELOPMENT ? 'debug' : 'release', OUT_DIR_NAME),
                get MODULE_OUT_ROOT() {
                    return path_1.resolve(this.MODULE_OUT_DIR, '../');
                },
            },
            foundDependencies: [],
            importMap: {
                imports: {},
                scopes: {},
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
                            src: (...xstateArgs) => searchForDependenciesService_1.searchForDependenciesService({ commonJSProjectDir }, xstateArgs),
                            onDone: {
                                target: 'mappingOutput',
                                actions: xstate_1.assign({ foundDependencies: (context, event) => event.data }),
                            },
                            onError: {
                                target: '#resultSteps.fail',
                            },
                        },
                    },
                    'mappingOutput': {
                        invoke: {
                            id: 'mapOutput',
                            src: (...xstateArgs) => mappingOutputService_1.mappingOutputService({ commonJSProjectDir }, xstateArgs[0]),
                            onDone: {
                                target: '#writeSteps',
                                actions: xstate_1.assign({ foundDependencies: (context, event) => event.data }),
                            },
                            onError: {
                                target: '#resultSteps.fail',
                            },
                        },
                    },
                },
            },
            'writing': {
                id: 'writeSteps',
                initial: 'ESModule',
                states: {
                    'ESModule': {
                        invoke: {
                            src: (...xstateArgs) => esModule_1.esModule({ commonJSProjectDir }, xstateArgs[0].foundDependencies[xstateArgs[0].processedModuleCount]),
                            onDone: [
                                {
                                    target: '#writeSteps.ImportMap',
                                    cond: (context) => {
                                        return context.processedModuleCount === context.foundDependencies.length;
                                    },
                                },
                                {
                                    target: '#writeSteps.ESModule',
                                    actions: xstate_1.assign({ processedModuleCount: (context, event) => context.processedModuleCount += 1 }),
                                },
                            ],
                            onError: [
                                {
                                    target: '#writeSteps.ESModuleIndex',
                                    cond: (context, event) => {
                                        return event.data.name === 'DidiPermissibleError';
                                    },
                                },
                                {
                                    target: '#resultSteps.fail',
                                },
                            ],
                        },
                    },
                    'ESModuleIndex': {
                        invoke: {
                            src: (...xstateArgs) => esModuleIndex_1.esModuleIndex({
                                moduleOutRoot: xstateArgs[0].constants.MODULE_OUT_ROOT,
                                currentDependency: xstateArgs[0].foundDependencies[xstateArgs[0].processedModuleCount],
                            }),
                            onDone: [
                                {
                                    target: '#writeSteps.ESModule',
                                    actions: xstate_1.assign({ processedModuleCount: (context) => context.processedModuleCount += 1 }),
                                    cond: (context) => {
                                        return context.processedModuleCount !== context.foundDependencies.length;
                                    },
                                },
                                {
                                    target: '#writeSteps.ImportMap',
                                    cond: (context) => {
                                        return context.processedModuleCount === context.foundDependencies.length;
                                    },
                                },
                                {
                                    target: '#resultSteps.fail',
                                },
                            ],
                            onError: {
                                target: '#resultSteps.fail',
                            },
                        },
                    },
                    'ImportMap': {
                        invoke: {
                            src: (...xstateArgs) => importMap_1.importMap({ commonJSProjectDir, options }, {
                                dependencies: xstateArgs[0].foundDependencies,
                                importMap: xstateArgs[0].importMap,
                                constants: xstateArgs[0].constants,
                            }),
                            onDone: {
                                target: '#writeSteps.ESModuleShim',
                                actions: xstate_1.assign({ importMap: (context, event) => event.data }),
                            },
                            onError: {
                                target: '#resultSteps.fail',
                            },
                        },
                    },
                    'ESModuleShim': {
                        invoke: {
                            src: (...xstateArgs) => esModuleShim_1.esModuleShim({ moduleOutRoot: xstateArgs[0].constants.MODULE_OUT_ROOT }),
                            onDone: {
                                target: '#writeSteps.IndexHtml',
                            },
                            onError: {
                                target: '#resultSteps.fail',
                            },
                        },
                    },
                    'IndexHtml': {
                        invoke: {
                            src: (...xStateArgs) => indexHTML_1.indexHTML({ options }, {
                                importMap: xStateArgs[0].importMap,
                                constants: xStateArgs[0].constants,
                            }),
                            onDone: {
                                target: '#resultSteps',
                            },
                            onError: {
                                target: '#resultSteps.fail',
                            },
                        },
                    },
                },
            },
            'result': {
                id: 'resultSteps',
                initial: 'success',
                states: {
                    'fail': {
                        type: 'final',
                    },
                    'success': {
                        type: 'final',
                    },
                },
            },
        },
    });
    const libDidiInstance = xstate_1.interpret(didiBuildMachine);
    libDidiInstance.start();
    return libDidiInstance;
};
