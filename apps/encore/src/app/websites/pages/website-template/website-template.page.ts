import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ColorPickerModule } from 'ngx-color-picker';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-website-template',
  templateUrl: './website-template.page.html',
  styleUrls: ['./website-template.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WebsiteTemplatePage {}

@NgModule({
  declarations: [WebsiteTemplatePage],
  imports: [
    CommonModule,

    MatMenuModule,
    MatMenuModule,
    MatTabsModule,

    CosButtonModule,
    CosCardModule,
    CosPillModule,

    ColorPickerModule,
  ],
})
export class WebsiteTemplatePageModule {}
