"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtmlIndex = void 0;
var didi_glue_1 = require("./didi-glue");
var NOTHING = '';
exports.generateHtmlIndex = function (_a) {
    var description = _a.description, importMapInlineContent = _a.importMapInlineContent, importMapUrl = _a.importMapUrl, lang = _a.lang, noScriptMessage = _a.noScriptMessage, polyFillScriptUrl = _a.polyFillScriptUrl, polyfillImportMap = _a.polyfillImportMap, scriptModuleUrl = _a.scriptModuleUrl, title = _a.title;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2, "\n<!doctype html>\n\n<html lang=\"" + lang + "\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>" + title + "</title>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <meta name=\"description\" content=\"" + description + "\">\n  <meta name=\"author\" content=\"" + title + "\">\n  <link rel=\"stylesheet\" href=\"css/styles.css?v=1.0\">\n  \n  " + (polyfillImportMap ? "<script type=\"text/javascript\" src=\"" + polyFillScriptUrl + "\" defer></script>" : NOTHING) + "\n  " + (importMapInlineContent && polyfillImportMap ?
                    "<script type=\"importmap-shim\" >" + importMapInlineContent + "</script>" :
                    "<script type=\"importmap\" src=\"" + importMapUrl + "\"></script>") + "\n  " + didi_glue_1.didiGlue() + "  \n  " + (importMapInlineContent && polyfillImportMap ?
                    "<script type=\"module-shim\">\n    import \"" + scriptModuleUrl + "\";\n    console.log(\"ran\")\n    </script>" :
                    "<script type=\"module\" src=\"" + scriptModuleUrl + "\"></script>") + "\n  \n</head>\n\n<body>\n  <noscript>" + noScriptMessage + "</noscript>\n  \n  <!---\n    This is a starter template, thank you for using Didi\n  -->\n</body>\n</html>\n  "];
        });
    });
};
