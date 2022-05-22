import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoginPageGuard } from './guards';
import { AuthPage, LoginPage } from './pages';

const routes: Route[] = [
  {
    path: 'auth',
    component: AuthPage,
    canActivate: [LoginPageGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        component: LoginPage,
        data: {
          analytics: {
            page: 'Login',
          },
        },
      },
      {
        path: 'forgotpassword',
        loadChildren: async () =>
          (
            await import(
              /* webpackChunkName: 'forgotpassword' */ './pages/forgot-password'
            )
          ).ForgotPasswordPageModule,
        data: {
          analytics: {
            page: 'ForgotPassword',
          },
        },
      },
      {
        path: 'resetpassword',
        loadChildren: async () =>
          (
            await import(
              /* webpackChunkName: 'resetpassword' */ './pages/reset-password'
            )
          ).ResetPasswordPageModule,
        data: {
          analytics: {
            page: 'ResetPassword',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
