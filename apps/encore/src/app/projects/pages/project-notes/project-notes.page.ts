import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'esp-project-notes',
  templateUrl: './project-notes.page.html',
  styleUrls: ['./project-notes.page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNotesPage {}

@NgModule({
  declarations: [ProjectNotesPage],
  imports: [],
})
export class ProjectNotesPageModule {}
