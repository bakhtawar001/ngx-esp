import { AppConfig } from '../types';

/**
 * Default Layout Configuration
 *
 * You can edit these options to change the default options. All these options also can be changed per component
 * basis. See `app/user/authentication/login/login.component.ts` constructor method to learn more
 * about changing these options per component basis.
 */
export const appConfig: AppConfig = {
  colorTheme: 'theme-default',
  layoutMode: 'fullwidth',
  customScrollbars: false,
  routerAnimation: 'fadeIn',
  layout: {
    footer: {
      position: 'below-static',
      cssClass: '',
    },
    navbar: {
      position: 'top',
      cssClass: 'cosmos-navy-50',
      header: {
        cssClass: 'cosmos-navy-900',
      },
      openBehavior: 'push',
    },
    toolbar: {
      position: 'below-fixed',
    },
  },
};
// new AppConfig({
//   customScrollbars: false,
//   layout: {
//     footer: {
//       position: 'none',
//     },
//     navbar: {
//       openBehavior: 'push',
//     },
//   },
// });
