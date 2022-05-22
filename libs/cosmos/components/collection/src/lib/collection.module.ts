import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateAgoPipeModule } from '@cosmos/common';
import { CosAvatarListModule } from '@cosmos/components/avatar-list';
import { CosCardModule } from '@cosmos/components/card';
import { CosEmojiMenuModule } from '@cosmos/components/emoji-menu';
import { CosProductGridModule } from '@cosmos/components/product-grid';
import { CosCollectionComponent } from './collection.component';
import { CosAvatarModule } from '@cosmos/components/avatar';

@NgModule({
  imports: [
    CommonModule,
    CosAvatarModule,
    CosAvatarListModule,
    CosEmojiMenuModule,
    CosProductGridModule,
    CosCardModule,

    DateAgoPipeModule,
  ],
  exports: [CosCollectionComponent],
  declarations: [CosCollectionComponent],
})
export class CosCollectionModule {}
