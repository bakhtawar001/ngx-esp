import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosRadioModule } from '@cosmos/components/radio';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem, NavigationModule } from '@cosmos/layout';
import { VerticalNavigationItemComponentModule } from '@cosmos/layout/navigation/components/vertical-navigation-item';
import { UntilDestroy } from '@ngneat/until-destroy';
import { OrderMenu } from '../../configs/menu.config';

@UntilDestroy()
@Component({
  selector: 'esp-website-orders',
  templateUrl: './website-orders.page.html',
  styleUrls: ['./website-orders.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteOrdersPage {
  activePage: NavigationItem;
  readonly menu = OrderMenu;
}

@NgModule({
  declarations: [WebsiteOrdersPage],
  imports: [
    CommonModule,
    CosButtonModule,
    CosCardModule,
    CosRadioModule,
    CosVerticalMenuModule,

    NavigationModule,
    VerticalNavigationItemComponentModule,

    MatMenuModule,
  ],
})
export class WebsiteOrdersPageModule {}
