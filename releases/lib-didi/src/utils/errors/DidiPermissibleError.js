"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidiPermissibleError = void 0;
class DidiPermissibleError extends Error {
    constructor(message) {
        super(`permissible: ${message}`);
        this.name = 'DidiPermissibleError';
    }
}
exports.DidiPermissibleError = DidiPermissibleError;
