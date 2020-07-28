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
exports.esModule = void 0;
const DidiPermissibleError_1 = require("../../utils/errors/DidiPermissibleError");
const toESM_1 = require("../../utils/toESM");
const writeESModule_1 = require("../../utils/writeESModule");
const DidiCompilerPanic_1 = require("../../utils/errors/DidiCompilerPanic");
exports.esModule = ({ commonJSProjectDir }, currentDependency) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentDependency) {
        if (currentDependency.output) {
            if (currentDependency.isDidiTarget) {
                throw new DidiPermissibleError_1.DidiPermissibleError('Found common js entry, rerouting state.');
            }
            else {
                const esmContent = yield toESM_1.tscESM(currentDependency.main, currentDependency);
                if (esmContent) {
                    yield writeESModule_1.writeESModule(currentDependency.output.dir, currentDependency.output.filename, esmContent);
                }
                else if (!currentDependency.skipped) {
                    throw new DidiCompilerPanic_1.DidiCompilerPanic('Received no input to transpile.');
                }
            }
        }
        else {
            throw new DidiCompilerPanic_1.DidiCompilerPanic('An internal error has occurred whilst mapping dependencies.');
        }
    }
});
