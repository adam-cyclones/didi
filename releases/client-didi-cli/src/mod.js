#!/usr/bin/env node
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidiCLIProgram = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
const lib_didi_1 = require("@didi-js/lib-didi");
const lib_didi_dev_server_1 = require("@didi-js/lib-didi-dev-server");
const commander_ts_1 = require("commander-ts");
let DidiCLIProgram = class DidiCLIProgram {
    constructor() {
        this.env = null;
    }
    run(path, polyfillImportMap) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!polyfillImportMap) {
                polyfillImportMap = true;
            }
            if (path) {
                const commonJSProjectDir = path_1.resolve(process.cwd(), path);
                const LibDiDiMachine = yield lib_didi_1.transpileToESModule({
                    profile: 'development',
                    options: {
                        compilerOptions: {},
                        polyfillImportMap: polyfillImportMap,
                    },
                    commonJSProjectDir,
                });
                LibDiDiMachine.onTransition((transition) => __awaiter(this, void 0, void 0, function* () {
                    const moduleWasWrote = transition.context.foundDependencies[transition.context.processedModuleCount];
                    const [stage, doing] = Object.entries(transition.value)[0];
                    switch (doing) {
                        case 'success':
                            console.log(`didi output ${transition.context.processedModuleCount} ES Modules`);
                            yield lib_didi_dev_server_1.devServer({
                                verbose: true,
                                root: transition.context.constants.MODULE_OUT_ROOT,
                                host: '127.0.0.1',
                                index: 'index.html',
                                port: 8086,
                            });
                            break;
                        case 'fail':
                            console.log(transition.event.type, '\n', transition.event);
                            break;
                        default:
                            if ((moduleWasWrote === null || moduleWasWrote === void 0 ? void 0 : moduleWasWrote.name) && !(moduleWasWrote === null || moduleWasWrote === void 0 ? void 0 : moduleWasWrote.isDidiTarget)) {
                                console.log(chalk_1.default `── {white ${stage}:} {green ✔ ${moduleWasWrote === null || moduleWasWrote === void 0 ? void 0 : moduleWasWrote.name}}`);
                            }
                            else {
                                if (doing === 'ESModule') {
                                }
                                else {
                                    console.log(chalk_1.default `── {white ${stage}:} {green ✔ ${doing}}`);
                                }
                            }
                            break;
                    }
                }));
            }
            else {
                console.log('The "path" argument must be of type string. Received no input.');
            }
        });
    }
};
__decorate([
    commander_ts_1.option('--env <env>')
], DidiCLIProgram.prototype, "env", void 0);
__decorate([
    commander_ts_1.command(),
    commander_ts_1.commandOption('--profile', '<development | production> production produces an optimized build. (defaults: development)'),
    commander_ts_1.commandOption('--polyfillImportMap', 'Until Import Maps stabilize'),
    __param(0, commander_ts_1.requiredArg('transpileToESModule')),
    __param(1, commander_ts_1.optionalArg('polyfillImportMap'))
], DidiCLIProgram.prototype, "run", null);
DidiCLIProgram = __decorate([
    commander_ts_1.program(),
    commander_ts_1.version('1.0.0'),
    commander_ts_1.description('Convert a project from common JS to ESmodules, with included bundler-like / task runner behaviour.'),
    commander_ts_1.usage('--help')
], DidiCLIProgram);
exports.DidiCLIProgram = DidiCLIProgram;
new DidiCLIProgram();
