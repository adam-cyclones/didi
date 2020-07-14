"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCoreModule = void 0;
var coreLibs = require('repl')._builtinLibs;
var extraBlacklist = [
    'util',
];
exports.isCoreModule = function (name) {
    return __spreadArrays(extraBlacklist, coreLibs).includes(name);
};
