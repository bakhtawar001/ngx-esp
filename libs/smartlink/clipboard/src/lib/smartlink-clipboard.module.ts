import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardState } from './store';
import { NgxsModule } from '@ngxs/store';
import { ClipboardService, ClipboardFacade } from './services';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([ClipboardState])],
  providers: [ClipboardService, ClipboardFacade],
})
export class SmartlinkClipboardModule {}
