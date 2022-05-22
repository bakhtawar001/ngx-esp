import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-encore-logo',
  templateUrl: './encore-logo.component.html',
  styleUrls: ['./encore-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {}

@NgModule({
  declarations: [LogoComponent],
  exports: [LogoComponent],
})
export class LogoComponentModule {}
