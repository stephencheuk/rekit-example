'use strict';

// Run this test before published to npm, it simulates a clean env for ensure rekit command could
// be installed globally and rekit-core, rekit-portal works as expected.


// 1. Uninstall rekit -g, npm unlink rekit from rekit folder.
// 2. Install rekit to global from local folder
// 3. run rekit create to create an app
// 4. install app (optional use local rekit-core and rekit-portal)
// 5. app test should pass
// 6. npm start for manually test

const path = require('path');
const shell = require('shelljs');
const expect = require('chai').expect;
const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Integration test.',
});

parser.addArgument(['--local-core'], {
  help: 'Whether to use local rekit-core. Otherwise install from npm repository.',
  action: 'storeTrue',
});

parser.addArgument(['--local-portal'], {
  help: 'Whether to use local rekit-portal. Otherwise install from npm repository.',
  action: 'storeTrue',
});

const args = parser.parseArgs();

function exec(cmd, opts) {
  expect(shell.exec(cmd, opts || {}).code).to.equal(0, 'Command failed, exit code should be 0');
}

const appName = 'a-rekit-npm-test-app';
const prjRoot = path.join(__dirname, '..');
const appRoot = path.join(prjRoot, '../', appName);
const appPkgJsonPath = path.join(appRoot, 'package.json');

console.log('Uninstalling Rekit globally......');
exec('npm uninstall -g rekit');

console.log('Unlinking Rekit......');
exec('npm unlink', { cwd: prjRoot });

console.log('Install Rekit globally from local folder...');
exec(`npm install -g ${prjRoot}`);

console.log('Create a new Rekit app...');
exec(`rekit create ${appName}`, { cwd: path.join(prjRoot, '..') });

const pkg = require(appPkgJsonPath); // eslint-disable-line
console.log('Use local rekit core optionally');
if (args.local_core) {
  pkg.devDependencies['rekit-core'] = path.join(prjRoot, '../rekit-core');
  shell.ShellString(JSON.stringify(pkg)).to(appPkgJsonPath);
}

console.log('Use local rekit portal optionally');
if (args.local_portal) {
  pkg.devDependencies['rekit-portal'] = path.join(prjRoot, '../rekit-portal');
  shell.ShellString(JSON.stringify(pkg)).to(appPkgJsonPath);
}

console.log('Install deps for the app...');
exec('yarn', { cwd: appRoot });

console.log('Run test for the app...');
exec('npm test', { cwd: appRoot });

console.log('Start the app...');
exec('npm start', { cwd: appRoot });
