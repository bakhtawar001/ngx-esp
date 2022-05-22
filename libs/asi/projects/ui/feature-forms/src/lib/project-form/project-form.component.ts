import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CurrencyDirectiveModule } from '@cosmos/common';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosCheckboxChange,
  CosCheckboxModule,
} from '@cosmos/components/checkbox';
import { CosFormFieldModule, FormStatus } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { ProjectDetailsForm } from '@esp/projects';
import { createMask, InputMaskModule } from '@ngneat/input-mask';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { AsiProjectFormHeaderDirective } from './project-form-header.directive';
import { AsiProjectFormPresenter } from './project-form.presenter';

@UntilDestroy()
@Component({
  selector: 'asi-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AsiProjectFormPresenter],
  encapsulation: ViewEncapsulation.None,
})
export class AsiProjectFormComponent implements OnInit {
  @Input()
  data: Partial<ProjectDetailsForm> = {};

  @Output()
  formValueChange = new EventEmitter<ProjectDetailsForm>();
  @Output()
  formStatusChange = new EventEmitter<FormStatus>();
  @Output()
  submitForm = new EventEmitter<void>();

  budgetInputFocused = false;

  attendeesInputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 0,
    allowMinus: false,
    showMaskOnHover: false,
  });

  readonly presenterValidation = AsiProjectFormPresenter.validation;
  readonly presenterFormErrors = AsiProjectFormPresenter.formErrors;

  constructor(public readonly presenter: AsiProjectFormPresenter) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (!this.presenter.form.valid) {
      return;
    }
    this.submitForm.emit();
  }

  private initForm(): void {
    this.presenter.initForm(this.data);

    this.presenter.form.valueChanges
      .pipe(
        filter(() => !this.presenter.form.pristine),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe((value: ProjectDetailsForm) => {
        this.formValueChange.emit(value);
      });

    this.presenter.form.statusChanges
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe(() => {
        this.formStatusChange.emit({
          valid: this.presenter.form.valid,
          dirty: this.presenter.form.dirty,
        });
      });
  }

  onEventTypeSearch(search: string): void {
    if (search !== this.presenter.form.controls.EventType.value) {
      const eventTypeControl = this.presenter.form.controls.EventType;
      eventTypeControl.setValue(search);
      eventTypeControl.markAsDirty();
    }
  }

  onFlexibleChange(event: CosCheckboxChange): void {
    this.presenter.form.controls.IsInHandsDateFlexible!.setValue(
      event.checked ? true : undefined
    );
  }

  onFirmChange(event: CosCheckboxChange): void {
    this.presenter.form.controls.IsInHandsDateFlexible!.setValue(
      event.checked ? false : undefined
    );
  }
}

@NgModule({
  declarations: [AsiProjectFormComponent, AsiProjectFormHeaderDirective],
  exports: [AsiProjectFormComponent, AsiProjectFormHeaderDirective],
  imports: [
    CommonModule,
    CurrencyDirectiveModule,
    CosAutocompleteModule,
    CosButtonModule,
    CosFormFieldModule,
    CosCheckboxModule,
    CosInputModule,
    InputMaskModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class AsiProjectFormModule {}
