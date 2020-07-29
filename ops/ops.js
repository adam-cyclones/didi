const TARGET = process.env.npm_lifecycle_event;
const prommpt = require('prompt-promise');
const cliSelect = require('cli-select');
const { resolve } = require('path');
const { promises } = require('fs');
const templateDir = require('template-dir');
const { writeFile, readFile, copyFile, mkdir } = promises;
const TscWatchClient = require('tsc-watch/client');
const rmfr = require('rmfr');
const { execSync, spawn } = require('child_process');
const prompts = require('prompts');
const getUpdateType = require('./helpers/issue-requires-label');
const { red, green, cyan } = require('chalk');

const scirpts = {
  /**
   * @description Add a package to sources using a template
   * */
  async ['add']() {
    const allowedPackageTypes = 'package type [lib / client]: ';
    const context = {
      version: {
        major: 0,
        minor: 1,
        patch: 0
      }
    }

    const build = async () => {
      const manifestFileName = './pkg-manifest.json';
      const currentManifestContent = require(manifestFileName);
      // write manifest
      if (currentManifestContent.find(pkg => pkg.name === context.name)) {
        throw new Error(`${context.name} already exists in pkg manifest, please choose a different name.`);
      } else {
        const newManifestContent = [...currentManifestContent, context];
        await writeFile(resolve(__dirname, manifestFileName), JSON.stringify(newManifestContent, null, 4), 'utf8');
        // write template to package

        templateDir(
          {
            source: resolve(__dirname, 'template', context.type),
            destination: context.sourcePath,
            onlyFiles: false,
          },
          {
            name: `@didi-js/${context.prefixedName}`,
            prefixName: context.prefixedName,
            version: '0.1.0',
            ext: '.ts',
            description: context.description,
            year: new Date().getFullYear(),
            copyrightHolder: 'Adam Crockett',
            author: execSync('git config user.name'),
            url: context.prefixedName === 'lib-docs-website' ? '/' : `/packages/${context.prefixedName}`
          },
        );

        // create release node_modules
        try {
          await mkdir(context.releasePath);
        } catch (e) {}
        try {
          await mkdir(resolve(context.releasePath, 'node_modules'));
        } catch (e) {}

        await copyFile(resolve(context.sourcePath, 'package.json'), resolve(context.releasePath, 'package.json'), 2);
        await copyFile(resolve(context.sourcePath, 'README.md'), resolve(context.releasePath, 'README.md'), 2);
        await copyFile(resolve(context.sourcePath, 'LICENSE'), resolve(context.releasePath, 'LICENSE'), 2);

        if (context.type === 'lib') {
          const std = execSync(`yarn --cwd ${context.releasePath} link`, {encoding: 'utf8'});
          console.log('\n'+std);
        } else {
          // client
          for (const scopeName of context.linkedLibs) {
            console.log(`✔ Linking libs: ${scopeName} to ${context.prefixedName}`);
            const std = execSync(`yarn --cwd ${context.releasePath} link ${scopeName}`);
            console.log(`\n${std}`);
          }
        }

        await this.build();
      }
    }

    const questionClientArgs = async () => {
      const { args } = await prompts([
        {
          type: 'text',
          name: 'args',
          message: 'Does this client require any arguments to develop against?'
        }
      ]);
      context.args = args;
    }

    const questionLinkedLibs = async () => {
      const manifestFileName = './pkg-manifest.json';
      const currentManifestContent = require(manifestFileName);
      const linkedLibs = await prompts([
        {
          type: 'multiselect',
          name: 'didi lib dependencies',
          message: 'Pick which didi libraries this client should link install.',
          choices: currentManifestContent.filter(pkg => pkg.type === 'lib').map(pkg => ({title: pkg.name, value: pkg.scopeName})),
        }
      ]);
      context.linkedLibs = linkedLibs['didi lib dependencies'] || [];
    }

    const questionDescription = async () => {
      context.description = await prommpt(`description: `);
      if (context.type === 'client') {
        await questionClientArgs();
        await questionLinkedLibs();
      }
      await build();
    }

    const questionName = async () => {
      context.name = await prommpt(`name: ${context.type}-`);
      context.prefixedName = `${context.type}-${context.name}`;
      context.scopeName = `@didi-js/${context.prefixedName}`;
      context.sourcePath = resolve('packages', context.prefixedName);
      context.releasePath = resolve('releases', context.prefixedName);
      context.docsPath = resolve('packages', 'website-didi', 'docs', 'api', 'packages', context.prefixedName);
      await questionDescription();
    }

    const questionType = async () => {
      try {
        const packageType = await prommpt(allowedPackageTypes);
        switch (packageType) {
          case 'lib':
          case 'client':
            context.type = packageType;
            await questionName();
            process.exit(0);
            break;
          default:
            throw `Invalid package type, allowed ${allowedPackageTypes}`
        }
      } catch (e) {
        console.log(e);
        console.log('Try again.');
        await this.add();
      }
    }
    
    // init
    await questionType();
  },
  /**
   * @description Remove a package from sources
   * */
  async ['remove']() {
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = require(manifestFileName);
    const choice = await cliSelect({
      values: currentManifestContent.map(pkg => pkg.name)
    });
    const manifestRecord = currentManifestContent.find(pkg => pkg.name === choice.value);
    try {
      // globally unlink this library
      if (manifestRecord.type === 'lib') {
        try {
          const result = execSync(`yarn --cwd ${manifestRecord.releasePath} unlink`, {encoding: 'utf8'});
          console.log('\n'+result);
        } catch (e) {
          console.log(e);
        }
        // remove lib from client
        const clientConsumers = currentManifestContent.filter(pkg => {
          if (pkg.linkedLibs && pkg.linkedLibs.includes(manifestRecord.scopeName)) {
            return pkg;
          } else {
            return false;
          }
        })
        // find all clients that use this lib
        clientConsumers.forEach(pkg => {
          try {
            const result = execSync(`rm ${pkg.releasePath}/node_modules/${manifestRecord.scopeName}`, {encoding: 'utf8'});
            console.log('\n'+result);
          } catch (e) {
            console.log(e);
          }
          pkg.linkedLibs = pkg.linkedLibs.filter(scopeName => scopeName !== manifestRecord.scopeName);
        });
        if (clientConsumers.length) {
          console.log(`WARN: The following clients potentially contain references to '${manifestRecord.scopeName}' (${clientConsumers.map(pkg => pkg.name).join(', ')}) please refactor.`)
        }
      }
      // remove dirs
      await rmfr(manifestRecord.sourcePath);
      await rmfr(manifestRecord.releasePath);
      await rmfr(manifestRecord.docsPath);
      // remove from manifest
      const newManifestContent = currentManifestContent.filter(pkg => pkg.name !== manifestRecord.name);
      await writeFile(resolve(__dirname, manifestFileName), JSON.stringify(newManifestContent, null, 4), 'utf8');
      console.log(`Removed ${manifestRecord.sourcePath}`);
      console.log(`Removed ${manifestRecord.releasePath}`);
    } catch (e) {
      console.error(e);
    }
  },
  async ['dev']() {
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = JSON.parse(await readFile(resolve(__dirname, manifestFileName)));
    const tsc = new TscWatchClient();
    const clientPackages = currentManifestContent.filter(pkg => pkg.type === 'client').map(pkg => pkg.scopeName);
    let devProc;
    const { toRun } = await prompts([
      {
        type: 'select',
        name: 'toRun',
        message: 'Select a client to start development',
        choices: clientPackages,
      }
    ]);

    const manifestRecord = currentManifestContent.find(pkg => pkg.scopeName === clientPackages[toRun]);

    // move other common files after build
    const firstPostCompile = async () => {
      console.log(`Starting client '${clientPackages[toRun]}' from '${manifestRecord.releasePath}'`)
    }
    const postCompile = async () => {
      if (devProc) {
        devProc.kill();
      }
      devProc = spawn('node', [manifestRecord.releasePath, manifestRecord.args ? manifestRecord.args : null ].filter(Boolean), { stdio: 'inherit' });
    }

    tsc.on('first_success', firstPostCompile);
    tsc.on('success', postCompile);

    tsc.start( '-b', ...currentManifestContent.map((pkg) => resolve(pkg.sourcePath, 'src', 'tsconfig.json')));
  },
  async ['build']() {
    console.log('building...')
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = JSON.parse(await readFile(resolve(__dirname, manifestFileName)));

    for (const pkg of currentManifestContent) {
      await copyFile(resolve(pkg.sourcePath, 'package.json'), resolve(pkg.releasePath, 'package.json'), 2);
      await copyFile(resolve(pkg.sourcePath, 'README.md'), resolve(pkg.releasePath, 'README.md'), 2);
      await copyFile(resolve(pkg.sourcePath, 'LICENSE'), resolve(pkg.releasePath, 'LICENSE'), 2);
    }

    try {
      const std = execSync(`npx tsc -b ${currentManifestContent.map((pkg) => resolve(pkg.sourcePath, 'src', 'tsconfig.json')).join(' ')}`, {encoding: 'utf8'});
      console.log(std);
    } catch (e) {
      // compile errors
      console.log(new Error(e));
      console.log(`\n    ${e.stdout}`)
    }
  },
  /**
   * @description Bump version for selected packages
   * */
  async ['version']() {
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = require(manifestFileName);
    let manualOnly = false;
    let bumpByIssueLabel;
    try {
      bumpByIssueLabel = await getUpdateType();
    } catch (e) {
      manualOnly = true;
    }

    const { packages, how } = await prompts([
      {
        type: 'multiselect',
        name: 'packages',
        message: 'Which didi packages should we bump versions.',
        choices: currentManifestContent.map(pkg => ({title: pkg.name, value: pkg.scopeName})),
      },
      {
        type: 'select',
        name: 'how',
        message: 'How do you want to bump versions.',
        choices: [ !manualOnly? 'smart - (based on github label)' : null, 'manually'].filter(Boolean),
      }
    ]);

    for (const selectedPkg of packages) {
      const manifestRecord = currentManifestContent.find(pkg => pkg.scopeName === selectedPkg);
      if (how === 0 && manualOnly === false) {
        // auto
        const bumpType = bumpByIssueLabel[0];
        // bump release and
        execSync(`yarn --cwd ${manifestRecord.sourcePath} version --${bumpType}`);
        execSync(`yarn --cwd ${manifestRecord.releasePath} version --${bumpType}`);
        currentManifestContent.find(pkg => pkg.scopeName === selectedPkg).version[bumpType] +=1;
      } else {
        // manual
        const { major: oldMajor, minor: oldMinor, patch: oldPatch } = manifestRecord.version;
        const {major, minor, patch} = await prompts([
          {
            type: 'number',
            name: 'major',
            initial: oldMajor,
            min: oldMajor,
            max: oldMajor + 1,
            message: `Major version for '${selectedPkg}'`
          },
          {
            type: 'number',
            name: 'minor',
            initial: oldMinor,
            min: oldMinor,
            max: oldMinor + 1,
            message: `Minor version for '${selectedPkg}'`
          },
          {
            type: 'number',
            name: 'patch',
            initial: oldPatch,
            min: oldPatch,
            max: oldPatch + 1,
            message: `Patch version for '${selectedPkg}'`
          },
        ]);
        console.log(`Bumping ${selectedPkg} version to ${major}.${minor}.${patch} from ${oldMajor}.${oldMinor}.${oldPatch}`);
        execSync(`yarn --cwd ${manifestRecord.sourcePath} version --new-version ${major}.${minor}.${patch}`);
        execSync(`yarn --cwd ${manifestRecord.releasePath} version --new-version ${major}.${minor}.${patch}`);
        // persist
        currentManifestContent.find(pkg => pkg.scopeName === selectedPkg).version = {
          major,
          minor,
          patch
        }
      }
      await writeFile(resolve(__dirname, manifestFileName), JSON.stringify(currentManifestContent, null, 4), 'utf8');
    }
  },
  /**
   * @description Publish selected packages
   * */
  async ['publish']() {
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = require(manifestFileName);
    const { packages } = await prompts([
      {
        type: 'multiselect',
        name: 'packages',
        message: 'Which didi packages should we publish?',
        choices: currentManifestContent.map(pkg => ({title: pkg.name, value: pkg.scopeName})),
      }
    ]);
    const { dryRun } = await prompts([
      {
        type: 'select',
        name: 'dryRun',
        message: 'is this a dry run?',
        choices: ['Yes', 'No'],
      }
    ]);

    // if client then preprocess dependents versions onto dependencies
    const libs = [];
    const clients = [];
    for (const selectedPkg of packages) {
      const manifestRecord = currentManifestContent.find(pkg => pkg.scopeName === selectedPkg);
      if (manifestRecord.type === 'lib') {
        libs.push({
          version: `${manifestRecord.version.major}.${manifestRecord.version.minor}.${manifestRecord.version.patch}`,
          name: manifestRecord.scopeName,
          releasePath: manifestRecord.releasePath,
          packageJSON: { ...require(resolve(manifestRecord.releasePath, 'package.json')), private: !(dryRun === 1) }
        });
      } else {
        // client
        clients.push({
          version: `${manifestRecord.version.major}.${manifestRecord.version.minor}.${manifestRecord.version.patch}`,
          name: manifestRecord.scopeName,
          releasePath: manifestRecord.releasePath,
          linkedLibs: manifestRecord.linkedLibs,
          packageJSON: { ...require(resolve(manifestRecord.releasePath, 'package.json')), private: !(dryRun === 1) }
        });
      }
    }
    const orderedPublishQueue = [...libs, ...clients];
    for (const pkg of orderedPublishQueue) {
      // libs publish first
      if (!pkg.linkedLibs) {
        console.log('Write client package.json?', pkg.packageJSON);
        const { looksOkay } = await prompts([
          {
            type: 'select',
            name: 'looksOkay',
            message: 'Does this library look okay?',
            choices: ['Yes', 'No'],
          }
        ]);
        if (looksOkay === 1 || looksOkay === undefined) {
          console.log('Something looks off? Go fix it and try again.')
          process.exit(0);
        } else {
          await writeFile(resolve(pkg.releasePath, 'package.json'), JSON.stringify(pkg.packageJSON, null, 4), 'utf8');
        }
        try {
          execSync(`yarn --cwd ${pkg.releasePath} publish --new-version ${pkg.version}`, {encoding: 'utf8'});
        } catch (e) {
          if (e.stderr.trim() === 'error Package marked as private, not publishing.') {
            console.log(`Successful dry run, nothing was published! Please ignore the above error.`);
          } else {
            throw new Error(e);
          }
        }
      }
      // clients publish last
      if (pkg.linkedLibs && pkg.linkedLibs.length) {
        const linkedLibs = pkg.linkedLibs.map(name => orderedPublishQueue.find(pkg => pkg.name === name));
        pkg.linkedLibs = {};
        // ensure dependent libs are published
        for (const lib of linkedLibs) {
          pkg.linkedLibs[lib.name] = lib.version;
        }
        // update release package.json
        if (!pkg.packageJSON.dependencies) {
          pkg.packageJSON.dependencies = {}
        }
        pkg.packageJSON.dependencies = {
          ...pkg.packageJSON.dependencies,
          ...pkg.linkedLibs
        }
        console.log('Write client package.json?', pkg.packageJSON)
        const { looksOkay } = await prompts([
          {
            type: 'select',
            name: 'looksOkay',
            message: 'Does this client look okay?',
            choices: ['Yes', 'No'],
          }
        ]);
        if (looksOkay === 1 || looksOkay === undefined) {
          console.log('Something looks off? Go fix it and try again.')
          process.exit(0);
        } else {
          await writeFile(resolve(pkg.releasePath, 'package.json'), JSON.stringify(pkg.packageJSON, null, 4), 'utf8');
          try {
            execSync(`yarn --cwd ${pkg.releasePath} publish --new-version ${pkg.version}`, {encoding: 'utf8'});
          } catch (e) {
            if (e.stderr.trim() === 'error Package marked as private, not publishing.') {
              console.log(`Successful dry run, nothing was published! Please ignore the above error, that's how it's done.`);
            } else {
              throw new Error(e);
            }
          }
        }
      }
    }
  },
  /**
   * @description relink selected lib packages to a client
   * */
  async link() {
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = JSON.parse(await readFile(resolve(__dirname, manifestFileName)));
    const allLibs = currentManifestContent.filter(pkg => pkg.type === 'lib');
    const clientPackages = currentManifestContent
      .filter(pkg => pkg.type === 'client')
      .map(pkg => ({ title: pkg.scopeName, value: pkg  }));

    const { client } = await prompts([
      {
        type: 'select',
        name: 'client',
        message: 'Select clients to link with dependant libs',
        choices: clientPackages,
      }
    ]);

    const prevLinks = client.linkedLibs;
    const { libsToChange } = await prompts([
      {
        type: 'multiselect',
        name: 'libsToChange',
        message: `Which libs should be linked to '${client.scopeName}'`,
        choices: allLibs
          .map(pkg => ({
            title: pkg.scopeName,
            value: pkg.scopeName,
            selected: client.linkedLibs.includes(pkg.scopeName)
          })),
      }
    ]);

    const diffTree = {
      '--': [],
      '++': [],
      '==': []
    }
    // additions
    for (const changes of libsToChange) {
      if (!prevLinks.includes(changes)) {
        console.log(`${green('++')} ${changes} ${green('link')}`)
        diffTree['++'].push(changes);
        console.log(`yarn --cwd ${client.releasePath} link ${changes}`)
        const std = execSync(`yarn --cwd ${client.releasePath} link ${changes}`);
        console.log(`\n${std}`);
      } else {
        // no change
        console.log(`${cyan('==')} ${changes} ${cyan('no changes.')}`);
        diffTree['=='].push(changes);
      }
    }
    // deletions
    for (const prev of prevLinks) {
      if (!libsToChange.includes(prev)) {
        console.log(`${red('--')} ${prev} ${red('unlink')}`);
        diffTree['--'].push(prev);
        console.log(`yarn --cwd ${client.releasePath} unlink ${prev}`);
        const std = execSync(`yarn --cwd ${client.releasePath} unlink ${prev}`);
        console.log(`\n${std}`);
      }
    }

    const currentPlusAdditions = [...diffTree['=='], ...diffTree['++']];
    const removeFromArray = (original, remove) => original.filter(value => !remove.includes(value));
    // persist
    for (const pkg of currentManifestContent) {
      if (pkg.name === client.name) {
        pkg.linkedLibs = removeFromArray(currentPlusAdditions, diffTree['--']);
      }
    }
    await writeFile(resolve(__dirname, manifestFileName), JSON.stringify(currentManifestContent, null, 4), 'utf8');
  },
  /**
   * @description run tests for a package
   * */
  async ['test']() {
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = require(manifestFileName);
    const testProcs = {}
    const { sourcePaths } = await prompts([
      {
        type: 'multiselect',
        name: 'sourcePaths',
        message: 'Which didi packages should we test concurrently.',
        choices: currentManifestContent.map(pkg => ({title: pkg.name, value: pkg.sourcePath})),
      }
    ]);

    for (const path of sourcePaths) {
      testProcs[path] = spawn('yarn', ['jest'], { stdio: 'inherit' });
    }
  },
  /**
   * @description generate docs
   * */
  async docs() {
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = require(manifestFileName);

    const { action } = await prompts([
      {
        type: 'select',
        name: 'action',
        message: 'What do you want to do with docs?',
        choices: ['build', 'serve'],
      }
    ]);

    const selectPackages = async () => {
      const { packages } = await prompts([
        {
          type: 'multiselect',
          name: 'packages',
          message: 'Which didi packages should we generate docs for?',
          choices: currentManifestContent.map(pkg => ({title: pkg.name, value: pkg.scopeName})),
        }
      ]);
      // build
      for (const selectedPkg of packages) {
        const manifestRecord = currentManifestContent.find(pkg => pkg.scopeName === selectedPkg);
        const typeDocMDArgs = [
          '--hideBreadcrumbs',
          '--skipSidebar',
          '--namedAnchors',
          '--hideGenerator',
          '--theme', 'docusaurus2',
        ];
        spawn('npx', [
          'typedoc',
            '--tsconfig', resolve(manifestRecord.sourcePath, 'src', 'tsconfig.json'),
            '--plugin', 'typedoc-plugin-markdown',
            ...typeDocMDArgs,
            '--out', manifestRecord.docsPath,
            manifestRecord.sourcePath
        ], { stdio: 'inherit' });
      }
    }

    switch (action) {
      case 0:
        await selectPackages();
        return;
      case 1:
        await selectPackages();
        spawn('yarn', ['--cwd', 'packages/website-didi', 'start'], {stdio: 'inherit'});
        return;
    }
  },
  /**
   * @description install sources and releases
   * */
  'install-all'() {
    spawn(`yarn`, ['install', '--didi-ops'], {stdio: 'inherit'});
    const manifestFileName = './pkg-manifest.json';
    const currentManifestContent = require(manifestFileName);
    for (const pkg of currentManifestContent) {
      spawn('yarn', ['--cwd', pkg.sourcePath, 'install'], {stdio: 'inherit'});
      spawn('yarn', ['--cwd', pkg.releasePath, 'install'], {stdio: 'inherit'});
    }
  }
}

scirpts[TARGET]();
