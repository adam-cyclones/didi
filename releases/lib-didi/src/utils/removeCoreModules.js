"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCore = void 0;
exports.removeCore = (targetModules) => {
    return targetModules.filter(mod => !mod.isCore);
};
