import { Params } from '@angular/router';

export interface INavigationItem {
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapsable';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: any[];
  classes?: string;
  exactMatch?: boolean;
  externalUrl?: boolean;
  openInNewTab?: boolean;
  function?: any;
  badge?: {
    title?: string | number;
    translate?: string;
    bg?: string;
    fg?: string;
  };
  children?: INavigationItem[];
  queryParamsHandling?: 'merge' | 'preserve';
  featureFlags?: string[];
  queryParams?: Params;
}

export class NavigationItem implements INavigationItem {
  id!: string;
  title!: string;
  type: 'item' | 'group' | 'collapsable' = 'item';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: any[];
  classes?: string;
  exactMatch?: boolean;
  externalUrl?: boolean;
  openInNewTab?: boolean;
  function?: any;
  badge?: {
    title?: string | number;
    translate?: string;
    bg?: string;
    fg?: string;
  };
  children?: INavigationItem[];
  queryParamsHandling?: 'merge' | 'preserve';
  featureFlags?: string[];
  queryParams?: Params;
}
