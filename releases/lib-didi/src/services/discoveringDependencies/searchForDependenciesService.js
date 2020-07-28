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
exports.searchForDependenciesService = void 0;
const resolveTree = require("resolve-tree");
const DidiCompilerPanic_1 = require("../../utils/errors/DidiCompilerPanic");
exports.searchForDependenciesService = ({ commonJSProjectDir }, ..._args) => __awaiter(void 0, void 0, void 0, function* () {
    const lookups = ['dependencies'];
    const resolveTreeOpts = {
        basedir: commonJSProjectDir,
        lookups,
    };
    return new Promise((resolve, reject) => {
        resolveTree.packages([commonJSProjectDir], resolveTreeOpts, (err, roots) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                reject(new DidiCompilerPanic_1.DidiCompilerPanic(err));
            }
            resolve(resolveTree.flatten(roots));
        }));
    });
});
