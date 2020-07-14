"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mappingOutputService = void 0;
var DidiCompilerPanic_1 = require("../../utils/errors/DidiCompilerPanic");
var path_1 = require("path");
var isCoreModule_1 = require("../../utils/isCoreModule");
var removeCoreModules_1 = require("../../utils/removeCoreModules");
var toExtMJS_1 = require("../../utils/toExtMJS");
exports.mappingOutputService = function (_a, context) {
    var commonJSProjectDir = _a.commonJSProjectDir;
    return __awaiter(void 0, void 0, void 0, function () {
        var withOutput;
        return __generator(this, function (_b) {
            withOutput = context.foundDependencies.map(function (dependency) {
                return {
                    name: dependency.name,
                    isDidiTarget: dependency.root === commonJSProjectDir,
                    main: require.resolve(dependency.root),
                    isCore: isCoreModule_1.isCoreModule(dependency.name),
                    output: {
                        main: path_1.resolve(context.constants.MODULE_OUT_DIR, dependency.name, dependency.version || '*', require.resolve(dependency.root).replace(dependency.root + '/', '')),
                        version: dependency.version,
                        get dir() {
                            return path_1.resolve(this.main, '../');
                        },
                        get filename() {
                            return path_1.basename(this.main).replace('.j', '.mj');
                        },
                    },
                    get importMapImportRecord() {
                        var _a;
                        var self = this;
                        if (self.output && typeof self.output.main === 'string' && dependency.version) {
                            return _a = {},
                                _a[self.isDidiTarget ? '_' : self.name] = self.isDidiTarget ?
                                    "" + path_1.sep + path_1.relative("" + commonJSProjectDir + path_1.sep + dependency.version, toExtMJS_1.toExtMJS(self.output.main)) :
                                    "" + path_1.sep + path_1.relative(path_1.resolve(context.constants.MODULE_OUT_DIR, '../'), toExtMJS_1.toExtMJS(self.output.main)),
                                _a;
                        }
                        else {
                            throw new DidiCompilerPanic_1.DidiCompilerPanic('An internal error occurred during creation of an import record');
                        }
                    },
                    get importMapScopeRecord() {
                        return {};
                    },
                };
            });
            return [2, removeCoreModules_1.removeCore(withOutput)];
        });
    });
};
