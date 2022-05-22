import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CompanyFormModel } from '@asi/company/ui/feature-core';
import {
  AsiCompanyFormComponentModule,
  AsiCompanyFormService,
} from '@asi/company/ui/feature-forms';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosDialogModule,
  DialogCloseStrategy,
  DialogWithDirtyCheck,
} from '@cosmos/components/dialog';
import { FormGroup } from '@cosmos/forms';
import { CompaniesActions } from '@esp/companies';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CreateCompanyDialogLocalState } from './create-company.local-state';
import { CreateCompanyDialogData } from './models';

@UntilDestroy()
@Component({
  selector: 'esp-create-company-dialog',
  templateUrl: './create-company.dialog.html',
  styleUrls: ['./create-company.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreateCompanyDialogLocalState],
})
export class CreateCompanyDialog
  extends DialogWithDirtyCheck<CreateCompanyDialog>
  implements OnInit
{
  readonly dialogCloseStrategy = DialogCloseStrategy.BACKDROP_CLICK;

  companyType!: string;
  formGroup!: FormGroup<CompanyFormModel>;
  isCreating = false;

  @ViewChild(MatDialogContent, { read: ElementRef })
  dialog!: ElementRef;

  constructor(
    private readonly _actions$: Actions,
    private readonly _companyFormService: AsiCompanyFormService,
    private readonly _confirmDialogService: ConfirmDialogService,
    @Inject(MAT_DIALOG_DATA) private readonly _data: CreateCompanyDialogData,
    private readonly _dialogRef: MatDialogRef<CreateCompanyDialog>,
    private readonly _state: CreateCompanyDialogLocalState
  ) {
    super(_dialogRef);
  }

  ngOnInit(): void {
    if (this._data.type) {
      this.companyType = this._data.type;
    }

    this.formGroup = this._companyFormService.getCompanyFormGroup(
      null,
      this.companyType
    );
  }

  submit(): void {
    const values = this._companyFormService.mapFormToCompanyData(
      this.formGroup.value
    );

    this._state.create(values);
    this.isCreating = true;

    this.listenToCreateFail();
    this.listenToCreateSuccess();
  }

  protected confirmLeave(): Observable<boolean> {
    return this._confirmDialogService.confirmDiscardChanges();
  }

  protected isDirty(): boolean {
    return this.formGroup.dirty;
  }

  private listenToCreateFail(): void {
    this._actions$
      .pipe(
        ofActionErrored(CompaniesActions.Create),
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.isCreating = false;
      });
  }

  private listenToCreateSuccess(): void {
    this._actions$
      .pipe(
        ofActionSuccessful(CompaniesActions.Create),
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this._dialogRef.close();
      });
  }
}

@NgModule({
  declarations: [CreateCompanyDialog],
  imports: [
    CommonModule,
    FormsModule,
    CosButtonModule,
    CosDialogModule,
    MatDialogModule,
    AsiCompanyFormComponentModule,
  ],
})
export class CreateCompanyDialogModule {}
