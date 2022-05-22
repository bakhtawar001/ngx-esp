import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { RecentlyViewedState } from './states';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([RecentlyViewedState])],
})
export class EspRecentlyViewedModule {}
