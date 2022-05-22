import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem, NavigationModule } from '@cosmos/layout';
import { VerticalNavigationItemComponentModule } from '@cosmos/layout/navigation/components/vertical-navigation-item';
import { UntilDestroy } from '@ngneat/until-destroy';
import { WebsiteSettingsMenu } from '../../configs/menu.config';
@UntilDestroy()
@Component({
  selector: 'esp-website-settings',
  templateUrl: './website-settings.page.html',
  styleUrls: ['./website-settings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteSettingsPage {
  activePage: NavigationItem;
  readonly settingsmenu = WebsiteSettingsMenu;
}

@NgModule({
  declarations: [WebsiteSettingsPage],
  imports: [
    CommonModule,
    CosButtonModule,
    CosCardModule,
    CosVerticalMenuModule,
    CosSegmentedPanelModule,
    CosSlideToggleModule,

    NavigationModule,
    VerticalNavigationItemComponentModule,

    MatMenuModule,
    MatDividerModule,
  ],
})
export class WebsiteSettingsPageModule {}
