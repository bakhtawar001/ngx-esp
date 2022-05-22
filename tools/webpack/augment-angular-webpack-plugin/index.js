const { AngularWebpackPlugin } = require('@ngtools/webpack');

/**
 * @typedef {import('webpack').Configuration} Configuration
 *
 * @typedef {import('typescript').CompilerOptions} CompilerOptions
 * @typedef {import('@angular/compiler-cli').CompilerHost} CompilerHost
 */

/**
 * This class aims to augment the `CompilerHost`, which is used to read files.
 * Angular doesn't use Webpack to load and process `.html` files, so we cannot use custom loaders.
 * We'd want to remove `data-cy` and `[attr.data-cy]` from production bundles since this is an extra production code.
 *
 * This expression `<div [attr.data-cy]="'cancel-button'"></div>" is compiled into this:
 * ```js
 * AppComponent.ɵcmp = ɵɵdefineComponent({
 *   type: AppComponent,
 *   template: (rf, ctx) => {
 *     if (rf & ɵRenderFlags.Create) {
 *       ɵɵelement(0, 'div', 0);
 *     }
 *     if (rf & ɵRenderFlags.Update) {
 *       ɵɵattribute('data-cy', 'cancel-button');
 *     }
 *   }
 * });
 * ```
 * The `ɵɵattribute` instruction runs `bindingUpdated` function which checks if the expression has been
 * updated or not, but it's a constant expression which is never updated.
 *
 * This expression `<div data-cy="cancel-button"></div>` is compiled into this:
 * ```js
 * AppComponent.ɵcmp = ɵɵdefineComponent({
 *   type: AppComponent,
 *   consts: [['data-cy', 'cancel-button']],
 *   template: (rf, ctx) => {
 *     if (rf & ɵRenderFlags.Create) {
 *       ɵɵelement(0, 'div', 0);
 *     }
 *   }
 * });
 * ```
 *
 * The flow of reading `.html` files looks as follows:
 * 1) ComponentDecoratorHandler.preanalyze
 * 2) ComponentDecoratorHandler._preloadAndParseTemplate
 * 3) AdapterResourceLoader.preload
 * 4) host = ts.createIncrementalCompilerHost()
 * 5) host.readResource (see `augmentHostWithResources`)
 * 6) host.readFile
 * 7) require('enhanced-resolve').CacheBackend.provideSync()
 * 8) require('fs').readFileSync()
 */
class AugmentAngularWebpackPlugin {
  searchValue = /\data-cy="(.*)"/g;
  replaceValue = '';

  /**
   * @param {Configuration} config
   */
  constructor(config) {
    this.config = config;
    this.augment();
  }

  augment() {
    // Let's augment the Webpack plugin only on production builds that are run on GitHub Actions.
    if (process.env.GITHUB_WORKFLOW === 'undefined') {
      return;
    }

    this.augmentUpdateAotProgram(
      this.config.plugins.find(
        (plugin) => plugin instanceof AngularWebpackPlugin
      )
    );
  }

  /**
   * @param {AngularWebpackPlugin} plugin
   */
  augmentUpdateAotProgram(plugin) {
    // https://github.com/angular/angular-cli/blob/master/packages/ngtools/webpack/src/ivy/plugin.ts#L441-L447

    // Let's intercept the call to `updateAotProgram` to retrieve the `host`. The `host` is a local variable that's created within the `apply` method, see:
    // https://github.com/angular/angular-cli/blob/master/packages/ngtools/webpack/src/ivy/plugin.ts#L221
    const updateAotProgram = plugin.updateAotProgram;

    /**
     * @param {CompilerOptions} compilerOptions
     * @param {string[]} rootNames
     * @param {CompilerHost} host
     * @param {unknown} diagnosticsReporter
     * @param {unknown} resourceLoader
     */
    plugin.updateAotProgram = (
      compilerOptions,
      rootNames,
      host,
      diagnosticsReporter,
      resourceLoader
    ) => {
      this.augmentHostWithResources(host);

      return updateAotProgram.call(
        plugin,
        compilerOptions,
        rootNames,
        host,
        diagnosticsReporter,
        resourceLoader
      );
    };
  }

  /**
   * @param {CompilerHost} host
   */
  augmentHostWithResources(host) {
    /**
     * @param {string} content
     * @returns {string}
     */
    const removeTestDataAttributes = (content) => {
      return content.replace(this.searchValue, this.replaceValue);
    };

    // https://github.com/angular/angular-cli/blob/master/packages/ngtools/webpack/src/ivy/host.ts#L28-L46
    const readResource = host.readResource;

    /**
     * @param {string} fileName
     */
    host.readResource = function (fileName) {
      const content = readResource.call(this, fileName);

      // If Angular is reading some component template (e.g. `app-root.component.html`),
      // then let's remove `[attr.test-data]` bindings.
      return fileName.endsWith('.html')
        ? removeTestDataAttributes(content)
        : content;
    };
  }
}

module.exports = { AugmentAngularWebpackPlugin };
