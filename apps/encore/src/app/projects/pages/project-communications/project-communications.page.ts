import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'esp-project-communications',
  templateUrl: './project-communications.page.html',
  styleUrls: ['./project-communications.page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCommunicationsPage {}

@NgModule({
  declarations: [ProjectCommunicationsPage],
  imports: [],
})
export class ProjectCommunicationsPageModule {}
