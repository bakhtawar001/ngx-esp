import {
  ICosmosConfig,
  LayoutModeType,
  RouterAnimationType,
} from '@cosmos/core';

import {
  FooterLayoutConfig,
  NavbarLayoutConfig,
  ToolbarLayoutConfig,
} from './layout-configs';

export class AppConfig implements ICosmosConfig {
  colorTheme?: string;
  layout?: {
    footer?: FooterLayoutConfig;
    navbar?: NavbarLayoutConfig;
    toolbar?: ToolbarLayoutConfig;
  };
  layoutMode?: LayoutModeType = 'fullwidth';
  customScrollbars? = true;
  routerAnimation?: RouterAnimationType = 'fadeIn';

  constructor(options?: Partial<AppConfig>) {
    Object.assign(this, options);

    if (options && options.layout) {
      this.layout.footer = new FooterLayoutConfig(options.layout.footer);
      this.layout.navbar = new NavbarLayoutConfig(options.layout.navbar);
      this.layout.toolbar = new ToolbarLayoutConfig(options.layout.toolbar);
    }
  }
}
