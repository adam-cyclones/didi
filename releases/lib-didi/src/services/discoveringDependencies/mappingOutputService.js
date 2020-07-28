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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mappingOutputService = void 0;
const DidiCompilerPanic_1 = require("../../utils/errors/DidiCompilerPanic");
const path_1 = require("path");
const isCoreModule_1 = require("../../utils/isCoreModule");
const removeCoreModules_1 = require("../../utils/removeCoreModules");
const toExtMJS_1 = require("../../utils/toExtMJS");
exports.mappingOutputService = ({ commonJSProjectDir }, context) => __awaiter(void 0, void 0, void 0, function* () {
    const withOutput = context.foundDependencies.map(dependency => {
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
                const self = this;
                if (self.output && typeof self.output.main === 'string' && dependency.version) {
                    return {
                        [self.isDidiTarget ? '_' : self.name]: self.isDidiTarget ?
                            `${path_1.sep}${path_1.relative(`${commonJSProjectDir}${path_1.sep}${dependency.version}`, toExtMJS_1.toExtMJS(self.output.main))}` :
                            `${path_1.sep}${path_1.relative(path_1.resolve(context.constants.MODULE_OUT_DIR, '../'), toExtMJS_1.toExtMJS(self.output.main))}`,
                    };
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
    return removeCoreModules_1.removeCore(withOutput);
});
