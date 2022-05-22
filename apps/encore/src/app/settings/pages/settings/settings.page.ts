import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CosVerticalMenuModule } from '@cosmos/components/vertical-menu';
import { NavigationItem } from '@cosmos/layout';
import { SettingsMenu } from '../../configs/menu.config';
import { SettingsPageLocalState } from './settings.page.local-state';
import { CosCardModule } from '@cosmos/components/card';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SettingsPageLocalState],
})
export class SettingsPage implements OnInit {
  menu: NavigationItem[] = SettingsMenu;

  constructor(private state: SettingsPageLocalState) {
    state.connect(this);
  }

  ngOnInit(): void {
    this.state.loadSettings();
  }
}

@NgModule({
  declarations: [SettingsPage],
  imports: [CommonModule, RouterModule, CosCardModule, CosVerticalMenuModule],
})
export class SettingsPageModule {}
