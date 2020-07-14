"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidiPermissibleError = void 0;
var DidiPermissibleError = (function (_super) {
    __extends(DidiPermissibleError, _super);
    function DidiPermissibleError(message) {
        var _this = _super.call(this, "permissible: " + message) || this;
        _this.name = 'DidiPermissibleError';
        return _this;
    }
    return DidiPermissibleError;
}(Error));
exports.DidiPermissibleError = DidiPermissibleError;
