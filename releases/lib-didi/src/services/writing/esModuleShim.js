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
exports.esModuleShim = void 0;
const fs_1 = require("fs");
const DidiCompilerPanic_1 = require("../../utils/errors/DidiCompilerPanic");
const path_1 = require("path");
const { readFile, writeFile, } = fs_1.promises;
exports.esModuleShim = ({ moduleOutRoot }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathToMinShim = require.resolve('es-module-shims').replace('.js', '.min.js');
        const nameOutputFile = path_1.basename(pathToMinShim);
        const shimContent = yield readFile(pathToMinShim, 'utf8');
        yield writeFile(`${moduleOutRoot}${path_1.sep}${nameOutputFile}`, shimContent, 'utf8');
    }
    catch (e) {
        throw new DidiCompilerPanic_1.DidiCompilerPanic('Could not write ES Modules shim');
    }
});
