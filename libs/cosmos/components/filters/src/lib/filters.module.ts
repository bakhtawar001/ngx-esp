import { A11yModule } from '@angular/cdk/a11y';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClickOutsideModule } from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import { CosPillModule } from '@cosmos/components/pill';
import { CosFilterButtonComponent } from './filter-button.component';
import { CosFilterControlsComponent } from './filter-controls.component';
import { CosFilterMenuComponent } from './filter-menu.component';
import { CosFiltersComponent } from './filters.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MatMenuModule,
    MatTooltipModule,
    CosButtonModule,
    CosPillModule,
    ClickOutsideModule,
    A11yModule,
    FormsModule,
  ],
  exports: [
    CosFiltersComponent,
    CosFilterMenuComponent,
    CosFilterButtonComponent,
    CosFilterControlsComponent,
  ],
  declarations: [
    CosFiltersComponent,
    CosFilterMenuComponent,
    CosFilterButtonComponent,
    CosFilterControlsComponent,
  ],
})
export class CosFiltersModule {}
