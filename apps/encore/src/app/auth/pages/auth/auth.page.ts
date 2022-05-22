import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponentModule } from '../../../core/components/logo/encore-logo.component';

@Component({
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {}

@NgModule({
  declarations: [AuthPage],
  imports: [CommonModule, RouterModule, LogoComponentModule],
})
export class AuthPageModule {}
