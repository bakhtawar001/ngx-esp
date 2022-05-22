import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AsiAuthService } from '@asi/auth';
import { EspAuthModule } from '@esp/auth';
import {
  SmartlinkAuthInterceptor,
  SmartlinkAuthService,
} from '@smartlink/auth';
import { environment } from '../../environments/environment';
import { AuthRoutingModule } from './auth-routing.module';
@NgModule({
  imports: [CommonModule],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<RootAuthModule> {
    return {
      ngModule: RootAuthModule,
    };
  }
}

@NgModule({
  imports: [
    EspAuthModule.forRoot(environment.auth),
    AuthRoutingModule,
    AuthModule,
  ],
  providers: [
    {
      provide: AsiAuthService,
      useExisting: SmartlinkAuthService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SmartlinkAuthInterceptor,
      multi: true,
    },
  ],
})
export class RootAuthModule {}
