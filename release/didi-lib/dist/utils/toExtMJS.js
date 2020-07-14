"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toExtMJS = void 0;
exports.toExtMJS = function (pathWithExtension) {
    if (pathWithExtension.endsWith('.js')) {
        return pathWithExtension.replace('.j', '.mj');
    }
    else {
        return pathWithExtension;
    }
};
