import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  templateUrl: './social-integrations.page.html',
  styleUrls: ['./social-integrations.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialIntegrationsPage {}

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class SocialIntegrationsPageModule {}
