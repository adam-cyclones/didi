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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtmlIndex = void 0;
const didi_glue_1 = require("./didi-glue");
const NOTHING = '';
exports.generateHtmlIndex = ({ description, importMapInlineContent, importMapUrl, lang, noScriptMessage, polyFillScriptUrl, polyfillImportMap, scriptModuleUrl, title, }) => __awaiter(void 0, void 0, void 0, function* () {
    return `
<!doctype html>

<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <meta name="author" content="${title}">
  <link rel="stylesheet" href="css/styles.css?v=1.0">
  
  ${polyfillImportMap ? `<script type="text/javascript" src="${polyFillScriptUrl}" defer></script>` : NOTHING}
  ${importMapInlineContent && polyfillImportMap ?
        `<script type="importmap-shim" >${importMapInlineContent}</script>` :
        `<script type="importmap" src="${importMapUrl}"></script>`}
  ${didi_glue_1.didiGlue()}  
  ${importMapInlineContent && polyfillImportMap ?
        `<script type="module-shim">
    import "${scriptModuleUrl}";
    console.log("ran")
    </script>` :
        `<script type="module" src="${scriptModuleUrl}"></script>`}
  
</head>

<body>
  <noscript>${noScriptMessage}</noscript>
  
  <!---
    This is a starter template, thank you for using Didi
  -->
</body>
</html>
  `;
});
