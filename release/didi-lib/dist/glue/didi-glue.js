"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.didiGlue = void 0;
exports.didiGlue = function () { return "\n<script type=\"text/javascript\">\n  // didi gluecode\n  window.process = undefined;\n  \n  let registry = [];\n  \n  window.addEventListener('DOMContentLoaded', () => {\n    window.importShim.fetch = new Proxy(window.importShim.fetch, {\n      apply(target, thisArg, argArray) {\n        registry = [...registry, ...argArray];\n        console.log(registry)\n        return Reflect.apply(target, thisArg, argArray);\n      }\n    });\n  });\n</script>\n"; };
