/**
 * This function ensures that the `isolatedModules` property is set on the `globals.ts-jest`,
 * this will disable type-checking when running Jest since this is a heavy process.
 * This also ensures the `jest-github-reporter` is set since this is our custom plugin.
 * This is loaded by `lint-staged.config.js` and is run when any `jest.config.js` is changed or added.
 * @param {string[]} files
 */
module.exports = (files) => {
  for (const file of files) {
    const { globals, reporters } = require(file);

    if (
      globals &&
      globals['ts-jest'] &&
      globals['ts-jest'].isolatedModules !== true
    ) {
      console.error(
        'Ensure to set the `isolatedModules` property within this config: ',
        file
      );

      process.exit(1);
    }

    if (reporters && reporters.indexOf('jest-github-reporter') === -1) {
      console.error(
        'Ensure to add the `jest-github-reporter` property to `reporters`: ',
        file
      );

      process.exit(1);
    }
  }

  return [`git add ${files.join(' ')}`];
};
