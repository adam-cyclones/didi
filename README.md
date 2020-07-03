# Didi
A bundleless bundler for JavaScript and Typescript which unpacks common.js modules into distinct ESmodules.

### TODO:
- setup this repo for contribution
- create some issues
- addreess all 'What doesnt work'
- Make a cool video, (can do this now as the thing works enough to demonstrate the concept)
- docs and website?
- Branding for Unpack!

### How it works:
- TSC successfully converts all common.js to ESmodule format, js and ts should be supported but not tested both - just JavaScript.
- A boilerplat project is output based on your input.
- minimal gluecode is emited but needed for browsers that dont support import maps, the positive is that ESM is then supported in browsers that are to old to support this, that includes dynamic import calls!
- A devserver is provided to test your sources.
- a devbrowser (headless browser). is used to prune all deps that where not actually used during the build step, a cache will be kept.
- Everything should just work from then on.

### What doesnt work:
- This is still very WIP we have one or two issues to address.
- Multiple versions of packages should be worked out and added to the scopes section of the import map, none of this works yet.
- The config client doesnt work yet.
- CDN imports should be downloaded just like Deno and cached, but this isnt a thing yet.
- CSS imports and others specified by the new importmap specification can work but dont yet.

### But I want it to work?
Very excited to see yo, PR's welcome!
