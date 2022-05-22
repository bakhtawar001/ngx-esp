import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AsiUiDetailsCardComponentModule } from '@asi/ui/details-card';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosDialogModule,
  DialogCloseStrategy,
} from '@cosmos/components/dialog';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosPresentationCardModule } from '@cosmos/components/presentation-card';
import { FormControl } from '@cosmos/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AsiCardsSelectionActionsDirective } from './cards-selection-dialog-actions.directive';
import { AsiCardsSelectionContentDirective } from './cards-selection-dialog-content.directive';

@UntilDestroy()
@Component({
  selector: 'asi-cards-selection-dialog',
  templateUrl: 'cards-selection-dialog.component.html',
  styleUrls: ['cards-selection-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsSelectionDialogComponent implements OnInit {
  @Input() closeDialogStrategy = DialogCloseStrategy.BACKDROP_CLICK;
  @Input() createButtonText!: string;
  @Input() header!: string;
  @Input() subheader!: string;
  @Input() searchPlaceholder!: string;
  @Input() initialSearchValue = '';

  @Output() create = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchControl!: FormControl<string>;

  ngOnInit(): void {
    this.searchControl = new FormControl(this.initialSearchValue);
    this.initSearchListener();
  }

  onSearchClear(): void {
    this.search.emit('');
    this.searchControl.setValue('');
  }

  onCreateClick(): void {
    this.create.emit();
  }

  private initSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((searchValue: string) => {
        this.search.emit(searchValue);
      });
  }
}

@NgModule({
  declarations: [
    CardsSelectionDialogComponent,
    AsiCardsSelectionContentDirective,
    AsiCardsSelectionActionsDirective,
  ],
  exports: [
    CardsSelectionDialogComponent,
    AsiCardsSelectionContentDirective,
    AsiCardsSelectionActionsDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CosButtonModule,
    CosFormFieldModule,
    CosInputModule,
    CosPresentationCardModule,
    CosDialogModule,
    MatDialogModule,
    AsiUiDetailsCardComponentModule,
  ],
})
export class CardsSelectionDialogComponentModule {}
