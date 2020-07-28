"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.didiGlue = void 0;
exports.didiGlue = () => `
<script type="text/javascript">
  // didi gluecode
  window.process = undefined;
  
  let registry = [];
  
  window.addEventListener('DOMContentLoaded', () => {
    window.importShim.fetch = new Proxy(window.importShim.fetch, {
      apply(target, thisArg, argArray) {
        registry = [...registry, ...argArray];
        console.log(registry)
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  });
</script>
`;
