"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alphaSortObject = void 0;
exports.alphaSortObject = function (object) {
    var ordered = {};
    var sortedKeys = Object.keys(object).sort();
    for (var _i = 0, sortedKeys_1 = sortedKeys; _i < sortedKeys_1.length; _i++) {
        var key = sortedKeys_1[_i];
        ordered[key] = object[key];
    }
    return ordered;
};
