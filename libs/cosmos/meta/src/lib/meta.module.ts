import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { MetaState } from './meta.state';
import { MetaService } from './meta.service';
import { MetaSettings, META_SETTINGS } from './symbols';

@NgModule({
  imports: [NgxsModule.forFeature([MetaState])],
})
export class MetaModule {
  static forRoot(settings: MetaSettings): ModuleWithProviders<MetaModule> {
    return {
      ngModule: MetaModule,
      providers: [
        MetaService,
        {
          provide: META_SETTINGS,
          useValue: settings,
        },
      ],
    };
  }
}
