import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  templateUrl: './whitelabel.page.html',
  styleUrls: ['./whitelabel.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhitelabelPage {}

@NgModule({
  declarations: [WhitelabelPage],
  imports: [CommonModule],
})
export class WhitelabelPageModule {}
