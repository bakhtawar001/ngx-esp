import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCardTreeModule } from '@cosmos/components/card-tree';
import { CosPillModule } from '@cosmos/components/pill';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem, NavigationModule } from '@cosmos/layout';
import { VerticalNavigationItemComponentModule } from '@cosmos/layout/navigation/components/vertical-navigation-item';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  CardMetadataListModule,
  ProjectCardModule,
  SalesOrderCardModule,
} from '../../../core/components/cards';
import { PagesMenu } from '../../configs/menu.config';

@UntilDestroy()
@Component({
  selector: 'esp-website-pages',
  templateUrl: './website-pages.page.html',
  styleUrls: ['./website-pages.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsitePagesPage {
  activePage: NavigationItem;
  readonly menu = PagesMenu;

  isDesktop = true;
  currentRoute = '';

  openItems = [
    {
      phases: [
        { complete: true, current: false },
        { complete: false, current: true },
        { complete: false, current: false },
        { complete: false, current: false },
        { complete: false, current: false },
      ],
      children: [{}, {}, {}],
      detailShown: true,
    },
  ];
}

@NgModule({
  declarations: [WebsitePagesPage],
  imports: [
    CommonModule,

    CardMetadataListModule,

    CosButtonModule,
    CosCardModule,
    CosPillModule,
    CosCardTreeModule,
    CosVerticalMenuModule,
    CosSlideToggleModule,

    ProjectCardModule,
    SalesOrderCardModule,
    NavigationModule,
    VerticalNavigationItemComponentModule,

    MatMenuModule,
  ],
})
export class WebsitePagesPageModule {}
