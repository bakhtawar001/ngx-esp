import { ILayoutConfig } from '@cosmos/core';

export type FooterPositionType =
  | 'above'
  | 'below-fixed'
  | 'below-static'
  | 'none';

export class FooterLayoutConfig implements ILayoutConfig {
  position?: FooterPositionType = 'below-static';
  cssClass? = 'cosmos-navy-900';

  constructor(options?: Partial<FooterLayoutConfig>) {
    Object.assign(this, options);
  }
}
