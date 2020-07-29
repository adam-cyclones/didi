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
exports.indexHTML = void 0;
const fs_1 = require("fs");
const DidiCompilerPanic_1 = require("../../utils/errors/DidiCompilerPanic");
const generate_html_index_1 = require("../../glue/generate-html-index");
const path_1 = require("path");
const { writeFile, } = fs_1.promises;
exports.indexHTML = ({ options }, { importMap, constants }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const htmlIndexContent = yield generate_html_index_1.generateHtmlIndex({
            lang: 'en',
            title: 'didi roars!',
            polyfillImportMap: true,
            description: 'Its a generated template, didi says you can change it.',
            importMapUrl: 'didi.importmap',
            noScriptMessage: 'You must enable JavaScript to use this application.',
            scriptModuleUrl: '_',
            polyFillScriptUrl: './es-module-shims.min.js',
            importMapInlineContent: JSON.stringify(importMap, null, 2),
        });
        yield writeFile(path_1.resolve(constants.MODULE_OUT_ROOT, 'index.html'), htmlIndexContent, 'utf8');
    }
    catch (e) {
        throw new DidiCompilerPanic_1.DidiCompilerPanic('Could not write index.html');
    }
});
