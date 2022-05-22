export interface DefaultRouteData {
  /** `defaultPath` is used by {@link RedirectGuard} */
  defaultPath?: string;
  /** `preload` is used by some {@link @cosmos/router } Preloading Strategies */
  preload?: true | false | 'always';
  /** `hideGlobalSearch` is used by the app root component to show or hide global search */
  hideGlobalSearch?: true;
  /** `roles` is used by the {@link AuthGuard} */
  roles?: string[];
  /** `meta.title` is used to specify the page title for the browser */
  meta?: {
    title?: string;
  };
  title?: string; //TODO determine if this is correct.
  analytics?: {
    page?: string;
  };
  searchType?: {
    value?: string;
    title?: string;
    type?: string;
  };

  globalSearchType?: 'products' | 'suppliers';
}
