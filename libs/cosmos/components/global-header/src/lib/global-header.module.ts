import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
import { ResizeObserverModule } from '@cosmos/layout';
import { CosInputModule } from '@cosmos/components/input';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { CosBottomMenuComponent } from './bottom-menu.component';
import {
  CosGlobalHeaderComponent,
  CosGlobalSearchComponent,
} from './global-header.component';
import { CosUserMenuComponent } from './user-menu.component';

@NgModule({
  imports: [
    CommonModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatMenuModule,
    CosButtonModule,
    CosInputModule,
    CosSlideToggleModule,
    RouterModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ResizeObserverModule,
  ],
  exports: [
    CosGlobalHeaderComponent,
    CosGlobalSearchComponent,
    CosBottomMenuComponent,
    CosUserMenuComponent,
  ],
  declarations: [
    CosGlobalHeaderComponent,
    CosGlobalSearchComponent,
    CosBottomMenuComponent,
    CosUserMenuComponent,
  ],
  entryComponents: [CosBottomMenuComponent],
})
export class CosGlobalHeaderModule {}
