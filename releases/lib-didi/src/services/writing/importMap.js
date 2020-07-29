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
exports.importMap = void 0;
const writeImportMap_1 = require("../../utils/writeImportMap");
const alphaSortObject_1 = require("../../utils/alphaSortObject");
exports.importMap = ({ commonJSProjectDir, options }, { dependencies, importMap, constants }) => __awaiter(void 0, void 0, void 0, function* () {
    const importMapRecords = dependencies.map((dependency) => {
        if (dependency.skipped) {
            return null;
        }
        else {
            return {
                imports: dependency.importMapImportRecord,
                scopes: dependency.importMapScopeRecord,
            };
        }
    })
        .filter(Boolean);
    for (const record of importMapRecords) {
        if (record && record.imports && record.scopes) {
            Object.assign(importMap.imports, record.imports);
            Object.assign(importMap.scopes, record.scopes);
        }
    }
    const alphaSortOutput = alphaSortObject_1.alphaSortObject(importMap);
    if (!options.polyfillImportMap) {
        yield writeImportMap_1.writeImportMap(constants.MODULE_OUT_ROOT, JSON.stringify(alphaSortOutput, null, 4));
    }
    return alphaSortOutput;
});
