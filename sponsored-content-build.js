const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
    const files = [
        './dist/apps/sponsored-content-elements/polyfills-es2015.js',
        './dist/apps/sponsored-content-elements/runtime-es2015.js',
        './dist/apps/sponsored-content-elements/main-es2015.js'
    ];

    const es5Files = [
        './dist/apps/sponsored-content-elements/polyfills-es5.js',
        './dist/apps/sponsored-content-elements/runtime-es5.js',
        './dist/apps/sponsored-content-elements/main-es5.js'
    ];

    await fs.ensureDir('elements');
    await fs.ensureDir('elements/sponsored-content');

    await concat(files, 'elements/sponsored-content/sponsored-content-element.js');
    await concat(es5Files, 'elements/sponsored-content/sponsored-content-element-es5.js');

    await fs.copyFile(
        './dist/apps/sponsored-content-elements/styles.css',
        'elements/sponsored-content/sponsored-content-styles.css'
    );

    await fs.copyFile(
        './dist/apps/sponsored-content-elements/index.html',
        'elements/sponsored-content/index.html'
    );
})();
