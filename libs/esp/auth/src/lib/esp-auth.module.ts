import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  AsiAuthModule,
  AuthServiceConfig,
  AUTH_SERVICE_CONFIG,
  UserService,
} from '@asi/auth';
import { NgxsModule } from '@ngxs/store';
import { IfAdminDirective, IfAuthUserDirective } from './directives';
import { EspUserService } from './services';
import { UserProfileState } from './states';

@NgModule({
  declarations: [IfAdminDirective, IfAuthUserDirective],
  imports: [CommonModule],
  exports: [IfAdminDirective, IfAuthUserDirective],
})
export class EspAuthModule {
  static forRoot(
    options?: AuthServiceConfig | any
  ): ModuleWithProviders<RootEspAuthModule> {
    const providers = [];

    if (options) {
      providers.push({
        provide: AUTH_SERVICE_CONFIG,
        useValue: options,
      });
    }

    return {
      ngModule: RootEspAuthModule,
      providers,
    };
  }
}

@NgModule({
  imports: [
    AsiAuthModule.forRoot(),
    EspAuthModule,
    NgxsModule.forFeature([UserProfileState]),
  ],
  providers: [{ provide: UserService, useClass: EspUserService }],
})
export class RootEspAuthModule {}
