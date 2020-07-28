"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alphaSortObject = void 0;
exports.alphaSortObject = (object) => {
    const ordered = {};
    const sortedKeys = Object.keys(object).sort();
    for (const key of sortedKeys) {
        ordered[key] = object[key];
    }
    return ordered;
};
