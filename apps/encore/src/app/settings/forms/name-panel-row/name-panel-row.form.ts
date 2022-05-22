import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { ValidateWhitespace } from '@cosmos/common';
import { CosInputModule } from '@cosmos/components/input';
import { CosInputRowModule } from '@cosmos/components/input-row';
import { FormGroup, FormGroupComponent } from '@cosmos/forms';
import { User } from '@esp/auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  NAME_PANEL_LOCAL_STATE,
  NamePanelRowLocalState,
} from './name-panel-row.local-state';

type NamePanelRowFormModel = Pick<User, 'GivenName' | 'FamilyName'>;

@UntilDestroy()
@Component({
  selector: 'esp-name-panel-row-form',
  templateUrl: './name-panel-row.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NamePanelRowForm extends FormGroupComponent<NamePanelRowFormModel> {
  readonly patternError = {
    pattern: "Only alphanumeric characters and &'()_-@;:., are allowed!",
  };

  @Input()
  isEditable = true;
  @Input()
  set isUser(isUser: boolean) {
    const validators = isUser
      ? [...this.validators, ...this.userValidators]
      : [...this.validators];

    this.form?.controls.GivenName.setValidators(validators);
    this.form?.controls.FamilyName.setValidators(validators);
  }

  private readonly validators = [Validators.required, ValidateWhitespace];
  private readonly userValidators = [
    // eslint-disable-next-line no-useless-escape
    Validators.pattern(/^[A-Za-z0-9&'\(\)_\-@;:\., ]+$/),
  ];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(NAME_PANEL_LOCAL_STATE)
    public readonly state: NamePanelRowLocalState
  ) {
    super();

    this.state
      .connect(this)
      .pipe(
        map((x) => x.data),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe((user: User) => {
        this.form?.reset(user || <NamePanelRowFormModel>{});
        this.changeDetectorRef.markForCheck();
      });
  }

  protected override createForm(): FormGroup<NamePanelRowFormModel> {
    return this._fb.group<NamePanelRowFormModel>({
      GivenName: ['', this.validators],
      FamilyName: ['', this.validators],
    });
  }
}

@NgModule({
  declarations: [NamePanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosInputRowModule,
    CosInputModule,

    AsiPanelEditableRowModule,
  ],
  exports: [NamePanelRowForm],
})
export class NamePanelRowFormModule {}
