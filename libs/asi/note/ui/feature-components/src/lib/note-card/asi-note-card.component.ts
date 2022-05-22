import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CosCardModule } from '@cosmos/components/card';
import { AsiNoteActionsItemsModule } from '@asi/note/ui/feature-components';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosInputModule } from '@cosmos/components/input';
import { CosButtonModule } from '@cosmos/components/button';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company, Contact, Note } from '@esp/models';
import { FormControl } from '@cosmos/forms';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { Avatar, CosAvatarListModule } from '@cosmos/components/avatar-list';
import {
  CosElapsedTimePipeModule,
  InitialsPipe,
  InitialsPipeModule,
} from '@cosmos/common';
import { NotesMockDB } from '@esp/notes';

@Component({
  selector: 'asi-note-card',
  templateUrl: './asi-note-card.component.html',
  styleUrls: ['./asi-note-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiNoteCardComponent implements OnInit {
  @Input() note: Note = NotesMockDB.Notes[0];
  @Input() item!: Company | Contact;

  @Output() noteDelete = new EventEmitter<number>();
  @Output() noteSave = new EventEmitter<{
    content: string;
    isShared: boolean;
  }>();

  public noteValue!: FormControl<string>;
  public isShared!: FormControl<boolean>;

  isEditState = false;
  isEditable!: boolean;
  avatars!: Avatar[];

  get isPrivate() {
    return this.note?.AccessLevel === 'Owner';
  }

  constructor(private readonly initialsPipe: InitialsPipe) {}

  ngOnInit() {
    this.noteValue = new FormControl<string>(this.note?.Content || '', [
      Validators.required,
    ]);
    !this.note && (this.isEditState = true);
    this.isShared = new FormControl<boolean>(!this.isPrivate);
    this.avatars = this.getOwner();
  }

  public onEdit(): void {
    this.isEditState = true;
  }

  public onDelete(): void {
    this.noteDelete.emit(this.note.Id);
  }

  public onSave(): void {
    this.noteSave.emit({
      content: this.noteValue.value,
      isShared: this.isShared.value,
    });
    this.isEditState = false;
  }

  public onCancel(): void {
    this.isEditState = false;
  }

  private getOwner(): Avatar[] {
    return (
      this.note?.Collaborators?.map((collaborator) => ({
        imgUrl: collaborator.ImageUrl,
        displayText: this.initialsPipe.transform(collaborator?.Name),
        toolTipText: collaborator.Name,
      })) || []
    );
  }
}

@NgModule({
  declarations: [AsiNoteCardComponent],
  exports: [AsiNoteCardComponent],
  imports: [
    CommonModule,
    CosCardModule,
    AsiNoteActionsItemsModule,
    CosAvatarModule,
    CosInputModule,
    CosButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CosCheckboxModule,
    CosSlideToggleModule,
    CosAvatarListModule,

    InitialsPipeModule,
    CosElapsedTimePipeModule,
  ],
})
export class AsiNoteCardModule {}
