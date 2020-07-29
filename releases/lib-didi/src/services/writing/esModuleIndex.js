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
exports.esModuleIndex = void 0;
const toESM_1 = require("../../utils/toESM");
const writeESModule_1 = require("../../utils/writeESModule");
const DidiCompilerPanic_1 = require("../../utils/errors/DidiCompilerPanic");
exports.esModuleIndex = ({ moduleOutRoot, currentDependency, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentDependency) {
        if (currentDependency.output && currentDependency.isDidiTarget) {
            const esmContent = yield toESM_1.tscESM(currentDependency.main, currentDependency);
            if (esmContent) {
                yield writeESModule_1.writeESModule(moduleOutRoot, currentDependency.output.filename, esmContent);
                if (currentDependency.skipped) {
                    throw new DidiCompilerPanic_1.DidiCompilerPanic('Could not transpile ES Module index!');
                }
            }
            else if (!currentDependency.skipped) {
                throw new DidiCompilerPanic_1.DidiCompilerPanic('Received no input to transpile ES Module index!');
            }
        }
        else {
            throw new DidiCompilerPanic_1.DidiCompilerPanic('An internal error has occurred whilst mapping dependencies.');
        }
    }
});
