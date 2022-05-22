import { ILayoutConfig } from '@cosmos/core';

export type NavbarPositionType = 'right' | 'left' | 'top' | 'none';
export type NavbarOpenBehaviorType = 'push' | 'slide';

export class NavbarLayoutConfig implements ILayoutConfig {
  position?: NavbarPositionType = 'left';
  cssClass? = 'cosmos-navy-50';
  header?: ILayoutConfig = { cssClass: 'cosmos-navy-900' };
  openBehavior?: NavbarOpenBehaviorType = 'slide';
  folded? = false;

  constructor(options?: Partial<NavbarLayoutConfig>) {
    Object.assign(this, options);
  }
}
