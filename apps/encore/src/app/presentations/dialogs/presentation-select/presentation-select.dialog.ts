import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AsiCompanyAvatarModule } from '@asi/company/ui/feature-components';
import { CardsSelectionDialogComponentModule } from '@asi/ui/cards-selection-dialog';
import {
  AsiDetailsCardLoaderComponentModule,
  AsiUiDetailsCardComponentModule,
} from '@asi/ui/details-card';
import { CosButtonModule } from '@cosmos/components/button';
import { CosDialogModule } from '@cosmos/components/dialog';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosPresentationCardModule } from '@cosmos/components/presentation-card';
import { trackItem } from '@cosmos/core';
import { PresentationSearch, SearchCriteria } from '@esp/models';
import { PresentationsActions } from '@esp/presentations';
import { SEARCH_LOCAL_STATE } from '@esp/search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  PresentationSelectDialogData,
  PresentationSelectDialogResult,
} from '../../models';
import { PresentationSelectDialogSearchLocalState } from './presentation-select.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-presentation-select',
  templateUrl: './presentation-select.dialog.html',
  styleUrls: ['./presentation-select.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PresentationSelectDialogSearchLocalState,
    {
      provide: SEARCH_LOCAL_STATE,
      useExisting: PresentationSelectDialogSearchLocalState,
    },
  ],
})
export class PresentationSelectDialog implements OnInit {
  subheader: string;
  presentations: PresentationSearch[];
  loadingSave = false;

  readonly trackById = trackItem<PresentationSearch>(['Id']);
  private readonly state$ = this.state.connect(this);

  constructor(
    private readonly store: Store,
    private _dialogRef: MatDialogRef<
      PresentationSelectDialog,
      PresentationSelectDialogResult
    >,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: PresentationSelectDialogData,
    public readonly state: PresentationSelectDialogSearchLocalState
  ) {
    this.subheader = data.input.subheader;
  }

  ngOnInit(): void {
    this.initStateListener();
  }

  onSearch(term: string): void {
    this.state.search({
      term,
      from: 1,
      editOnly: true,
    } as SearchCriteria);
  }

  onSelectPresentation(presentation: PresentationSearch): void {
    if (this.loadingSave) return;
    this.loadingSave = true;

    this.store
      .dispatch(
        new PresentationsActions.AddProducts(
          presentation.Id,
          presentation.Project.Name,
          Array.from(this.data.input.checkedProducts.keys())
        )
      )
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this._dialogRef.close({ action: 'next', data: { complete: true } });
      });
  }

  onCreateNewPresentation(): void {
    this._dialogRef.close({
      action: 'next',
      data: {
        createNew: true,
      },
    });
  }

  private initStateListener(): void {
    this.state$
      .pipe(
        map(({ presentations }) => presentations),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe((presentations: PresentationSearch[]) => {
        this.presentations = presentations;
      });
  }
}

@NgModule({
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
    AsiCompanyAvatarModule,
    CardsSelectionDialogComponentModule,
    AsiDetailsCardLoaderComponentModule,
  ],
  declarations: [PresentationSelectDialog],
  exports: [PresentationSelectDialog],
})
export class PresentationSelectDialogModule {}
