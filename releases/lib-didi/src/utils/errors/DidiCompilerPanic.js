"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidiCompilerPanic = void 0;
class DidiCompilerPanic extends Error {
    constructor(message) {
        super(message);
        this.name = 'DidiCompilerPanic';
    }
}
exports.DidiCompilerPanic = DidiCompilerPanic;
