import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'esp-contact-notes',
  templateUrl: './contact-notes.component.html',
  styleUrls: ['./contact-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactNotesComponent {}

@NgModule({
  declarations: [ContactNotesComponent],
  exports: [ContactNotesComponent],
})
export class ContactNotesComponentModule {}
