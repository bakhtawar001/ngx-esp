import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CosNotificationModule } from '@cosmos/components/notification';
import { CosmosLayoutModule } from '@cosmos/layout';
import { EspAutocompleteModule } from '@esp/autocomplete';
import { EspLookupTypesModule } from '@esp/lookup-types';
import { CustomRouterStateSerializer, RouterFacade } from '@esp/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import {
  NgxsRouterPluginModule,
  RouterStateSerializer,
} from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { SmartlinkProductsModule } from '@smartlink/products';
import { environment } from '../../environments/environment';
import { AppRootComponentModule } from './components/app-root/app-root.component';
import { SERVICE_CONFIG_PROVIDERS } from './configs';
import { appConfig } from './configs/app.config';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    RouterModule,
    MatDialogModule,

    AppRootComponentModule,

    CosNotificationModule,
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<RootCoreModule> {
    return {
      ngModule: RootCoreModule,
    };
  }
}

@NgModule({
  imports: [
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: ['auth'],
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    CosmosLayoutModule.forRoot(appConfig, null),
    SmartlinkProductsModule,
    EspAutocompleteModule,
    EspLookupTypesModule,
    CoreModule,
  ],
  providers: [
    RouterFacade,
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    ...SERVICE_CONFIG_PROVIDERS,
  ],
})
export class RootCoreModule {}
