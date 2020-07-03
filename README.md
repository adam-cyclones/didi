<!-- PROJECT LOGO -->
<br />
<span style="text-align: center;">
  <a href="https://github.com/adam-cyclones/didi">
    <img src="docs/assets/didi-logo.png" alt="didi the dino is a pterodactyl logo" width="120" height="120">
  </a>

  <h3 align="center">didi</h3>

  <p align="center">
    A transpiler for JavaScript and Typescript, unpacking CommonJS modules into distinct ES Modules.
  </p>
</span>

## Who uses didi?
TLDR; Both frontend developers and deno developers might find didi useful.

### Want to help build the future of the web?
There is a growing list or tasks as didi heads for 1.0.0. Team didi:
- Adam Crockett (nice to meet you!)
- Do you want to join team didi?

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

### Community action 
We want to build a collaborative open source community for didi, here are the actions the community decided.
- [Vote: choose the name for didi, (formally unpack)](https://dev.to/adam_cyclones/name-this-software-opinion-needed-40m8)
- [Vote: choose the logo for didi](https://dev.to/adam_cyclones/didi-help-me-choose-a-logo-3mo4)
- [Chat with Deno - Can we be dinosaurs too?](https://github.com/denoland/deno/issues/6625)