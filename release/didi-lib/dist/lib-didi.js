"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpileToESModule = void 0;
var path_1 = require("path");
var xstate_1 = require("xstate");
var esModule_1 = require("./services/writing/esModule");
var esModuleIndex_1 = require("./services/writing/esModuleIndex");
var esModuleShim_1 = require("./services/writing/esModuleShim");
var importMap_1 = require("./services/writing/importMap");
var indexHTML_1 = require("./services/writing/indexHTML");
var mappingOutputService_1 = require("./services/discoveringDependencies/mappingOutputService");
var searchForDependenciesService_1 = require("./services/discoveringDependencies/searchForDependenciesService");
exports.transpileToESModule = function (_a) {
    var commonJSProjectDir = _a.commonJSProjectDir, profile = _a.profile, options = _a.options;
    process.chdir(commonJSProjectDir);
    var DEVELOPMENT = (profile || 'development') === 'development';
    var DIST_DIR_NAME = 'target';
    var OUT_DIR_NAME = 'es_modules';
    var didiBuildMachine = xstate_1.Machine({
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
                            src: function () {
                                var xstateArgs = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    xstateArgs[_i] = arguments[_i];
                                }
                                return searchForDependenciesService_1.searchForDependenciesService({ commonJSProjectDir: commonJSProjectDir }, xstateArgs);
                            },
                            onDone: {
                                target: 'mappingOutput',
                                actions: xstate_1.assign({ foundDependencies: function (context, event) { return event.data; } }),
                            },
                            onError: {
                                target: '#resultSteps.fail',
                            },
                        },
                    },
                    'mappingOutput': {
                        invoke: {
                            id: 'mapOutput',
                            src: function () {
                                var xstateArgs = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    xstateArgs[_i] = arguments[_i];
                                }
                                return mappingOutputService_1.mappingOutputService({ commonJSProjectDir: commonJSProjectDir }, xstateArgs[0]);
                            },
                            onDone: {
                                target: '#writeSteps',
                                actions: xstate_1.assign({ foundDependencies: function (context, event) { return event.data; } }),
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
                            src: function () {
                                var xstateArgs = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    xstateArgs[_i] = arguments[_i];
                                }
                                return esModule_1.esModule({ commonJSProjectDir: commonJSProjectDir }, xstateArgs[0].foundDependencies[xstateArgs[0].processedModuleCount]);
                            },
                            onDone: [
                                {
                                    target: '#writeSteps.ImportMap',
                                    cond: function (context) {
                                        return context.processedModuleCount === context.foundDependencies.length;
                                    },
                                },
                                {
                                    target: '#writeSteps.ESModule',
                                    actions: xstate_1.assign({ processedModuleCount: function (context, event) { return context.processedModuleCount += 1; } }),
                                },
                            ],
                            onError: [
                                {
                                    target: '#writeSteps.ESModuleIndex',
                                    cond: function (context, event) {
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
                            src: function () {
                                var xstateArgs = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    xstateArgs[_i] = arguments[_i];
                                }
                                return esModuleIndex_1.esModuleIndex({
                                    moduleOutRoot: xstateArgs[0].constants.MODULE_OUT_ROOT,
                                    currentDependency: xstateArgs[0].foundDependencies[xstateArgs[0].processedModuleCount],
                                });
                            },
                            onDone: [
                                {
                                    target: '#writeSteps.ESModule',
                                    actions: xstate_1.assign({ processedModuleCount: function (context) { return context.processedModuleCount += 1; } }),
                                    cond: function (context) {
                                        return context.processedModuleCount !== context.foundDependencies.length;
                                    },
                                },
                                {
                                    target: '#writeSteps.ImportMap',
                                    cond: function (context) {
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
                            src: function () {
                                var xstateArgs = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    xstateArgs[_i] = arguments[_i];
                                }
                                return importMap_1.importMap({ commonJSProjectDir: commonJSProjectDir, options: options }, {
                                    dependencies: xstateArgs[0].foundDependencies,
                                    importMap: xstateArgs[0].importMap,
                                    constants: xstateArgs[0].constants,
                                });
                            },
                            onDone: {
                                target: '#writeSteps.ESModuleShim',
                                actions: xstate_1.assign({ importMap: function (context, event) { return event.data; } }),
                            },
                            onError: {
                                target: '#resultSteps.fail',
                            },
                        },
                    },
                    'ESModuleShim': {
                        invoke: {
                            src: function () {
                                var xstateArgs = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    xstateArgs[_i] = arguments[_i];
                                }
                                return esModuleShim_1.esModuleShim({ moduleOutRoot: xstateArgs[0].constants.MODULE_OUT_ROOT });
                            },
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
                            src: function () {
                                var xStateArgs = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    xStateArgs[_i] = arguments[_i];
                                }
                                return indexHTML_1.indexHTML({ options: options }, {
                                    importMap: xStateArgs[0].importMap,
                                    constants: xStateArgs[0].constants,
                                });
                            },
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
    var libDidiInstance = xstate_1.interpret(didiBuildMachine);
    libDidiInstance.start();
    return libDidiInstance;
};
