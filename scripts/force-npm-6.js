const { execSync } = require('child_process');

// We use that script except of `package.json > engines` because it'll act as a warning.
// See https://docs.npmjs.com/cli/v8/configuring-npm/package-json#engines

const FORCED_NPM_VERSION = '6';
const UNCAUGHT_FATAL_EXCEPTION = 1;

// E.g. `6.14.15`
const version = execSync('npm -v').toString().trim();

if (!version.startsWith(FORCED_NPM_VERSION)) {
  console.error(
    'Your local NPM version seems to be greater than 6. We are forcing to use the NPM@6 for now.'
  );
  process.exit(UNCAUGHT_FATAL_EXCEPTION);
}
