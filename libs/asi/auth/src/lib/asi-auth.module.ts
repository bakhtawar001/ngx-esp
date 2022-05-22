import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import {
  AsiAuthInterceptor,
  AsiInsufficientPermissionsInterceptor,
} from './interceptors';
import { AuthState, LoginFormState } from './states';
import { AuthServiceConfig, AUTH_SERVICE_CONFIG } from './types';

@NgModule({
  imports: [CommonModule],
})
export class AsiAuthModule {
  static forRoot(
    options?: AuthServiceConfig | any
  ): ModuleWithProviders<RootAsiAuthModule> {
    const providers = [];

    if (options) {
      providers.push({
        provide: AUTH_SERVICE_CONFIG,
        useValue: options,
      });
    }

    return {
      ngModule: RootAsiAuthModule,
      providers,
    };
  }
}

@NgModule({
  imports: [NgxsModule.forFeature([AuthState, LoginFormState]), AsiAuthModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AsiAuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AsiInsufficientPermissionsInterceptor,
      multi: true,
    },
  ],
})
export class RootAsiAuthModule {}
