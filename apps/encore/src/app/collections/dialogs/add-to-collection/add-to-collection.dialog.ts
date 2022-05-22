import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCollectionModule } from '@cosmos/components/collection';
import { CosInputModule } from '@cosmos/components/input';
import { CosNewButtonModule } from '@cosmos/components/new-button';
import { FormBuilder } from '@cosmos/forms';
import { Collection, SearchCriteria } from '@esp/collections';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs/operators';
import { AddToCollectionLocalState } from './add-to-collection.local-state';
import {
  AddToCollectionDialogData,
  AddToCollectionDialogResult,
} from './models';

@UntilDestroy()
@Component({
  selector: 'esp-add-to-collection-dialog',
  templateUrl: './add-to-collection.dialog.html',
  styleUrls: ['./add-to-collection.dialog.scss'],
  providers: [AddToCollectionLocalState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionDialog implements OnDestroy {
  private _limit = 5;

  public searchForm = this.getFormGroup();

  constructor(
    public readonly state: AddToCollectionLocalState,
    private _dialogRef: MatDialogRef<
      AddToCollectionDialog,
      AddToCollectionDialogResult
    >,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: AddToCollectionDialogData
  ) {
    state.connect(this);

    this.search();

    this.searchForm.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe(() => this.search());
  }

  ngOnDestroy() {
    this.state.reset();
  }

  get showMoreButtonVisible(): boolean {
    return this.state?.collections?.length > this._limit;
  }

  get collections(): any[] {
    return this.state.collections.slice(0, this._limit);
  }

  getFormGroup() {
    return this._fb.group<SearchCriteria>({
      term: [''],
      from: 1,
      size: 20,
      sortBy: '',
      status: ['Active'],
      excludeList: [this.data.currentCollectionId?.toString() || ''],
    });
  }

  cardClick(collection: Collection) {
    this._dialogRef.close(collection);
  }

  create() {
    this._dialogRef.close('create');
  }

  showMore() {
    this._limit = this.state.collections.length;
  }

  public search() {
    this.state.search({
      ...this.searchForm.value,
      editOnly: true,
    });
  }
}

@NgModule({
  declarations: [AddToCollectionDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatDialogModule,

    CosButtonModule,
    CosCollectionModule,
    CosInputModule,
    CosNewButtonModule,
  ],
})
export class AddToCollectionDialogModule {}
