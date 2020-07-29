"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCoreModule = void 0;
const coreLibs = require('repl')._builtinLibs;
const extraBlacklist = [
    'util',
];
exports.isCoreModule = (name) => {
    return [
        ...extraBlacklist,
        ...coreLibs,
    ].includes(name);
};
