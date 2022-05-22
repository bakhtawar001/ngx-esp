import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { VideoService, UniqueIdService } from '@cosmos/core';

import { CosVideoPlayerComponent } from './video-player.component';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [CosVideoPlayerComponent],
  providers: [VideoService, UniqueIdService],
  declarations: [CosVideoPlayerComponent],
})
export class CosVideoPlayerModule {}
