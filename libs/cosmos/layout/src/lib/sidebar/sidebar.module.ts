import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { SidebarState } from './store';
import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [NgxsModule.forFeature([SidebarState])],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {}
