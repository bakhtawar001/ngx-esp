import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { DesignSettingsState, SettingsState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([SettingsState, DesignSettingsState])],
})
export class EspSettingsModule {}
