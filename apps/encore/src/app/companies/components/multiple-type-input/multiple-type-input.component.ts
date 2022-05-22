import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, SkipSelf } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import {
  EspLookupSelectComponentModule,
  LookupTypeKey,
} from '@esp/lookup-types';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-multiple-type-input',
  templateUrl: './multiple-type-input.component.html',
  styleUrls: ['./multiple-type-input.component.scss'],
})
export class MultipleTypeInputComponent {
  @Input() type: Exclude<LookupTypeKey, 'OrderStatuses' | 'Tags'>;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() controlName: string;
  @Input() validator?: string;
  @Input() maxlength? = 100;

  constructor(
    @SkipSelf()
    protected parent: ControlContainer
  ) {}

  get parentForm() {
    return this.parent?.control as FormGroup;
  }

  get multiTypeFormArray(): FormArray {
    return this.parentForm.get(this.type) as FormArray;
  }

  public remove(index: number): void {
    if (this.multiTypeFormArray.length > 0)
      this.multiTypeFormArray.removeAt(index);
  }
}

@NgModule({
  declarations: [MultipleTypeInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CosButtonModule,
    CosInputModule,

    EspLookupSelectComponentModule,
  ],
  exports: [MultipleTypeInputComponent],
})
export class MultipleTypeInputComponentModule {}
