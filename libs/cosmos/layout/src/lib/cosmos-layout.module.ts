import { ModuleWithProviders, NgModule } from '@angular/core';

import { COSMOS_CONFIG, ICosmosConfig } from '@cosmos/core';

import { COSMOS_NAVIGATION, NavigationItem } from './navigation';

import { FooterModule } from './footer';
import { NavigationModule } from './navigation';
import { SidebarModule } from './sidebar';

const LAYOUT_MODULES = [FooterModule, NavigationModule, SidebarModule];

@NgModule()
export class CosmosLayoutModule {
  static forRoot(
    config: ICosmosConfig,
    navigation: NavigationItem[]
  ): ModuleWithProviders<CosmosLayoutModule> {
    return {
      ngModule: RootCosmosLayoutModule,
      providers: [
        {
          provide: COSMOS_CONFIG,
          useValue: config,
        },
        {
          provide: COSMOS_NAVIGATION,
          useValue: navigation,
        },
      ],
    };
  }
}

@NgModule({
  imports: LAYOUT_MODULES,
  exports: LAYOUT_MODULES,
})
export class RootCosmosLayoutModule {}
