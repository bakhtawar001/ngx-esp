import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsPage {}

@NgModule({
  declarations: [TeamsPage],
  imports: [CommonModule],
})
export class TeamsPageModule {}
