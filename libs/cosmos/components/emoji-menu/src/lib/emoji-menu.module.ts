import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { CosEmojiMenuComponent } from './emoji-menu.component';

@NgModule({
  imports: [CommonModule, PickerModule, EmojiModule, MatMenuModule],
  declarations: [CosEmojiMenuComponent],
  exports: [CosEmojiMenuComponent],
})
export class CosEmojiMenuModule {}
