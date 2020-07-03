# didi
A transpiler for JavaScript and Typescript, unpacking CommonJS modules into distinct ES Modules.

## Who uses didi?
TLDR; Both frontend developers and deno developers might find didi useful.

### TODO:
There is a growing list or tasks as didi heads for 1.0.0. Team didi:
- Adam Crockett
- You?

We need your help, lets break away from bundlers, support didi.

### How it works:
- You can use the CLI to run didi.
- didi ships with an embedded custom TypeScript compiler.
- When successful, TSC converts all found JavaScript and Typescript in CommonJS modules to distinct ES Modules under a single `es_modules` directory.
- A complete starter project for the browser can be generated or for deno just the `es_modules` directory.
- didi strives to generate minimal glue-code but as of today browsers that don't support import-maps will need the es_modules_polyfill (default), The positive side effect is that didi enables support for ES Modules in aging browsers, that includes dynamic import calls!
- A dev-server is provided to test your sources during build, then finally serve a development environment.
- a dev-browser (headless browser). is used to prune all deps that where not actually used during the build step, a cache will be kept afterwards, keeping build times down.
- Everything should just work from then on. - but if it doesn't, PR's and issues welcome.

### But I want it to work?
Very excited to see you, PR's welcome!