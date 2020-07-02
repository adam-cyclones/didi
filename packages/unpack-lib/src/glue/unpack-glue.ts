export const unpackGlue = () => `
<script type="text/javascript">
  // Unpack gluecode
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