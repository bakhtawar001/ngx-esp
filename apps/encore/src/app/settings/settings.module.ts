import { NgModule } from '@angular/core';
import { EspSettingsModule } from '@esp/settings';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [EspSettingsModule, SettingsRoutingModule],
})
export class SettingsModule {}
