const fs = require('fs');
const path = require('path');
const { output } = require('@nrwl/workspace');

function replaceTemplate(oldTemplatePath, newTemplate) {
  try {
    fs.writeFileSync(oldTemplatePath, newTemplate);

    output.log({
      title: `The '${oldTemplatePath}' has been replaced.`,
    });
  } catch (error) {
    output.error({
      title: 'Unable to replace the template: ' + error.message,
    });
    throw error;
  }
}

/**
 * Replace the original `test-setup.ts` file that imports the `jest-preset-angular/setup-jest` with our custom
 * Jest setup, which is `@cosmos/testing/setup`. This will allow developers to generate libraries using schematics
 * without having to replace that import every time.
 */
function replaceJestTestSetupTemplate() {
  const oldTemplatePath = path.join(
    __dirname,
    '../node_modules/@nrwl/jest/src/generators/jest-project/files-angular/src/test-setup.ts__tmpl__'
  );

  const newTemplate = fs
    .readFileSync(path.join(__dirname, '../templates/test-setup.template'))
    .toString();

  replaceTemplate(oldTemplatePath, newTemplate);
}

/**
 * Replace the original component template w/o empty constructor and `ngOnInit`. Our template also contains an NgModule
 * that allows the developer follow the SCAM approach.
 */
function replaceAngularComponentTemplate() {
  const oldTemplatePath = path.join(
    __dirname,
    '../node_modules/@schematics/angular/component/files/__name@dasherize@if-flat__/__name@dasherize__.__type@dasherize__.ts.template'
  );

  const newTemplate = fs
    .readFileSync(path.join(__dirname, '../templates/component.template'))
    .toString();

  replaceTemplate(oldTemplatePath, newTemplate);
}

module.exports = () => {
  // Do not replace templates when `postinstall` is being run on the Netlify or GitHub.
  if (typeof process.env.CI !== 'undefined') {
    return;
  }

  replaceJestTestSetupTemplate();
  replaceAngularComponentTemplate();
};
