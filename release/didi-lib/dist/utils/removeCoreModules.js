"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCore = void 0;
exports.removeCore = function (targetModules) {
    return targetModules.filter(function (mod) { return !mod.isCore; });
};
