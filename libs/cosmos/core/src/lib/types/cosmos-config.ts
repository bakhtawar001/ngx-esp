import { Dictionary } from './dictionary';

export type LayoutModeType = 'boxed' | 'fullwidth';
export type RouterAnimationType =
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideRight'
  | 'slideLeft'
  | 'none';

export interface ICosmosConfig {
  colorTheme?: string;
  customScrollbars?: boolean;
  layout?: Dictionary<any>;
  layoutMode?: LayoutModeType;
  routerAnimation?: RouterAnimationType;
}

export interface ILayoutConfig {
  position?: any;
  cssClass?: string;
}
