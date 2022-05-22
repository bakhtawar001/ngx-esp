import { ILayoutConfig } from '@cosmos/core';

export type ToolbarPositionType =
  | 'above'
  | 'below-fixed'
  | 'below-static'
  | 'none';

export class ToolbarLayoutConfig implements ILayoutConfig {
  position?: ToolbarPositionType = 'below-fixed';
  // cssClass? = 'cosmos-white-500';

  constructor(options?: Partial<ToolbarLayoutConfig>) {
    Object.assign(this, options);
  }
}
