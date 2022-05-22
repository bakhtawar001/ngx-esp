import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem, NavigationModule } from '@cosmos/layout';
import { VerticalNavigationItemComponentModule } from '@cosmos/layout/navigation/components/vertical-navigation-item';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ProductMenu } from '../../configs/menu.config';

@UntilDestroy()
@Component({
  selector: 'esp-website-products',
  templateUrl: './website-products.page.html',
  styleUrls: ['./website-products.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteProductsPage {
  activePage: NavigationItem;
  readonly menu = ProductMenu;
}
@NgModule({
  declarations: [WebsiteProductsPage],
  imports: [
    CommonModule,
    CosButtonModule,
    CosCardModule,
    CosVerticalMenuModule,
    CosSlideToggleModule,

    NavigationModule,
    VerticalNavigationItemComponentModule,

    MatMenuModule,
  ],
})
export class WebsiteProductsPageModule {}
