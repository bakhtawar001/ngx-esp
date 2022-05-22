import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'esp-website-overview',
  templateUrl: './website-overview.page.html',
  styleUrls: ['./website-overview.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteOverviewPage {}

@NgModule({
  declarations: [WebsiteOverviewPage],
  imports: [
    CommonModule,
    MatMenuModule,
    CosButtonModule,
    CosCardModule,
    CosPillModule,
    MatMenuModule,
  ],
})
export class WebsiteOverviewPageModule {}
