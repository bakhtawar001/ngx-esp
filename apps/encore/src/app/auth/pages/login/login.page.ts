import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { LoginComponentModule } from '../../components/login';

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}

@NgModule({
  declarations: [LoginPage],
  imports: [CommonModule, LoginComponentModule],
})
export class LoginPageModule {}
