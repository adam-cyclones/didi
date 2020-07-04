<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/adam-cyclones/didi">
    <img src="docs/assets/didi-logo.png" alt="didi the dino is a pterodactyl logo" width="120" height="120">
  </a>

  <h3 align="center">didi</h3>

  <p align="center">
    A transpiler for JavaScript and Typescript, transforming CommonJS modules into distinct ES Modules.
  </p>
</p>

## Who uses didi?
Both frontend developers and deno developers will find didi useful.

### How it works:
- You can use the CLI to run didi.
- didi ships with an embedded custom TypeScript compiler.
- When successful, TSC converts all found JavaScript and Typescript in CommonJS modules to distinct ES Modules under a single `es_modules` directory.
- A complete starter project for the browser can be generated or for deno just the `es_modules` directory.
- didi strives to generate minimal glue-code but as of today browsers that don't support import-maps will need the es_modules_polyfill (default), The positive side effect is that didi enables support for ES Modules in aging browsers, that includes dynamic import calls!
- A dev-server is provided to test your sources during build, then finally serve a development environment.
- A dev-browser (headless browser). is used to prune all deps that where not actually used during the build step, a cache will be kept afterwards, keeping build times down.
- Everything should just work from then on. - but if it doesn't, PR's and issues welcome.

### Experimental ahoy
We are very excited to see you again, didi is still experimental but functional, PR's welcome!

## Building for development
To commit code to didi
``` sh
cd ../path/to/didi
yarn install
```
didi is split into packages so that we can work on what we need to.
Every didi package has the same scripts to `build`, simply run `yarn build-all`

Here are all the build commands if you wish you build just one package
```json
{
    "build-all": "yarn build-cli-client build-config-client build-devbrowser build-devserver build-lib",
    "build-cli-client": "yarn --cwd ./packages/didi-cli-client build",
    "build-config-client": "yarn --cwd ./packages/didi-config-client build",
    "build-devbrowser": "yarn --cwd ./packages/didi-devbrowser build",
    "build-devserver": "yarn --cwd ./packages/didi-devserver build",
    "build-lib": "yarn --cwd ./packages/didi-lib build"
}
```
At the moment, `didi-cli-client` is the main way to interact with the software, You should start here, by building the cli
lib-didi will also be built and should result in a single binary under the `release` folder, this is the binary we will be
shipping. The plan is to create an npm and denoland package should be created to distribute the binary as well.

## Usage
Currently the only way to use didi is to build from source as per the above, you would then do something like this
```sh
./packages/didi-cli-client/release/didi ~/path/to/example-project
```

## What to expect
The result should look a little like this:
<div>
    <img src="docs/screenshots/didi-out.png" alt="didi wrote some boilerplate, and ES Modules from CommonJS">
</div>

### Docs
Coming soon.

## Community

### Want to help build the future of the web?
There is a growing [list or tasks](https://github.com/adam-cyclones/didi/issues) as didi heads for 1.0.0. Team didi:
- [Adam Crockett](https://dev.to/adam_cyclones)
    > "We need your help, lets break away from bundlers, support didi"
- Do you want to join team didi or maybe leave us a star?

### Community action 
We want to build a collaborative open source community for didi, here are the actions the community decided so far.
- [Vote: choose the name for didi, (formally unpack)](https://dev.to/adam_cyclones/name-this-software-opinion-needed-40m8)
- [Vote: choose the logo for didi](https://dev.to/adam_cyclones/didi-help-me-choose-a-logo-3mo4)
- [Chat with Deno - Can we be dinosaurs too?](https://github.com/denoland/deno/issues/6625)

#### Meta
- Logo by Adam Crockett
- दीदी - didi means sister, we are sister a too deno in the sense that we share similar goals, remove CommonJs packages and (for us, CommonJs bundles) from the equation and make packeges widely available in a "Webby" way that conforms to EcmaScript standards.
