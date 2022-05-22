import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  MAT_DATE_LOCALE,
  MATERIAL_SANITY_CHECKS,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosNotificationModule } from '@cosmos/components/notification';
import { AppSettingsModule } from '@cosmos/core';
import { CosmosLayoutModule } from '@cosmos/layout';
import { NG_EVENT_PLUGINS } from '@cosmos/ng-event-plugins';
import { EspAutocompleteModule } from '@esp/autocomplete';
import { EspCollectionsModule } from '@esp/collections';
import { EspLookupTypesModule } from '@esp/lookup-types';
import { EspPresentationsModule } from '@esp/presentations';
import { EspProjectsModule } from '@esp/projects';
import { EspRecentlyViewedModule } from '@esp/recently-viewed';
import { CustomRouterStateSerializer } from '@esp/router';
import {
  NgxsRouterPluginModule,
  RouterStateSerializer,
} from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { enUS } from 'date-fns/locale';
import { environment } from '../../environments/environment';
import { AppRootComponentModule } from './components/app-root/app-root.component';
import { formFieldErrorsConfig, SERVICE_CONFIG_PROVIDERS } from './configs';
import { appConfig } from './configs/app.config';

@NgModule({
  imports: [
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
      selectorOptions: {
        /*
        For now we will still suppress errors in production, but not in dev mode.
        These should be resolved in dev mode, and then eventually we can flip this flag to be `false` in production too.
        */
        suppressErrors: environment.production,
      },
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: ['auth', 'appSettings'],
    }),

    environment.imports,

    CosmosLayoutModule.forRoot(appConfig, null),
    CosFormFieldModule.forRoot(formFieldErrorsConfig),
    AppSettingsModule,
    EspAutocompleteModule,
    EspCollectionsModule.forRoot(),
    EspLookupTypesModule,
    EspProjectsModule.forRoot(),
    EspPresentationsModule,
    EspRecentlyViewedModule,
    CoreModule,
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    // We don't need any prebuilt Material theme and we don't wanna see these warnings in the console.
    { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    // https://github.com/angular/components/blob/master/src/material-date-fns-adapter/adapter/date-fns-adapter.spec.ts#L29-L30
    { provide: MAT_DATE_LOCALE, useValue: enUS },
    SERVICE_CONFIG_PROVIDERS,
    ...(environment.providers || []),
    NG_EVENT_PLUGINS,
  ],
})
export class RootCoreModule {}
