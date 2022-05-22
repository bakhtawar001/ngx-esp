import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'asi-note-actions-items',
  templateUrl: './asi-note-actions-items.component.html',
  styleUrls: ['./asi-note-actions-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiNoteActionsItemsComponent {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}

@NgModule({
  declarations: [AsiNoteActionsItemsComponent],
  exports: [AsiNoteActionsItemsComponent],
  imports: [MatMenuModule],
})
export class AsiNoteActionsItemsModule {}
