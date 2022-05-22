const path = require('path');
const { output } = require('@nrwl/workspace');
const { projects } = require('../angular.json');

const LIBRARY_ROOT_PREFIX = 'libs/';
function getLibraryName(root) {
  // The library name (or alias) should match the path w/o the `libs/` prefix.
  // For instance, if the library is located within the `libs/cosmos/components/notification` folder,
  // then the library name should be `@cosmos/components/notification`.
  return '@' + root.slice(LIBRARY_ROOT_PREFIX.length);
}

const errors = [];

Object.values(projects)
  .filter(
    ({ projectType, architect }) =>
      // We're not interested in apps and projects that don't have the `build` target.
      projectType === 'library' && !!architect.build
  )
  .forEach(({ root }) => {
    const libraryPath = path.join(__dirname, '../', root);
    const libraryName = getLibraryName(root);
    const packageJson = require(`${libraryPath}/package.json`);

    if (packageJson.name !== libraryName) {
      errors.push({
        title: `The library name, located within the ${root} folder, is invalid: "${packageJson.name}". It should be "${libraryName}".`,
      });
    }

    const ngPackageJson = require(`${libraryPath}/ng-package.json`);
    // The `path.relative()` calculates the relative path with an additional parent path.
    // For instance, the output path for `libs/smartlink/search` must be `../../../dist/libs/smartlink/search`,
    // but the `path.relative()` returns `../../../../dist/libs/smartlink/search`. The `slice(3)` basically
    // removes that additional link to the parent directory (`../`).
    const outputPath = path.relative(root, `../dist/${root}`).slice(3);

    if (ngPackageJson.dest !== outputPath) {
      errors.push({
        title: `The destination is invalid: "${ngPackageJson.dest}". It should be "${outputPath}".`,
      });
    }
  });

if (errors.length > 0) {
  errors.forEach((error) => output.error(error));
  process.exit(1);
} else {
  output.success({
    title: 'All libraries have been checked successfully.',
  });
}
