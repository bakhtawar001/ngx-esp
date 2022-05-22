import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AppSettingsState } from './states';

@NgModule({
  imports: [NgxsModule.forFeature([AppSettingsState])],
})
export class AppSettingsModule {}
