import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'asi-insufficient-permissions-page',
  templateUrl: './insufficient-permissions.page.html',
  styleUrls: ['./insufficient-permissions.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiInsufficientPermissionsPage {}

@NgModule({
  declarations: [AsiInsufficientPermissionsPage],
  exports: [AsiInsufficientPermissionsPage],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AsiInsufficientPermissionsPage },
    ]),
  ],
})
export class AsiInsufficientPermissionsPageModule {}
