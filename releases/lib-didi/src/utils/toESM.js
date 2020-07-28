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
exports.tscESM = void 0;
const typescript_1 = require("typescript");
const cjs_to_esm_transformer_1 = require("@wessberg/cjs-to-esm-transformer");
const fs_1 = require("fs");
const { readFile, } = fs_1.promises;
exports.tscESM = (path, target) => __awaiter(void 0, void 0, void 0, function* () {
    let tscResult;
    const content = yield readFile(path, 'utf8');
    try {
        tscResult = typescript_1.transpileModule(content, {
            transformers: cjs_to_esm_transformer_1.cjsToEsm(),
            compilerOptions: {
                module: typescript_1.ModuleKind.ESNext,
            },
        });
    }
    catch (e) {
        target.output.skipped = true;
        console.warn('\n[Warning] skipping a module, unable to transpile ESM!', path, `
- Try installing the latest version of this library: '${path}' as a dependency of your project.
`);
        return '';
    }
    if (tscResult.outputText) {
        return tscResult.outputText;
    }
    else {
        return `throw new Error('didi failed to parse this file.') ${content}`;
    }
});
