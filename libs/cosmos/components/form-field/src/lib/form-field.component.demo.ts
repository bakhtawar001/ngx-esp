import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'cos-form-example-component',
  template: `
    <cos-form-field>
      <cos-label>Favorite Food</cos-label>
      <input cos-input #input maxlength="10" [formControl]="food" />
      <cos-hint align="end">{{ input.value?.length || 0 }}/10</cos-hint>
      <cos-error *ngIf="food.invalid">{{ getErrorMessageFood() }}</cos-error>
    </cos-form-field>
    <cos-form-field [hideRequiredMarker]="hideRequiredMarker">
      <cos-label>Enter an email</cos-label>
      <input
        placeholder="test@test.com"
        cos-input
        [formControl]="email"
        required="hideRequiredMarker"
      />
      <cos-hint *ngIf="!hideRequiredMarker">Required</cos-hint>
      <cos-error *ngIf="email.invalid">{{ getErrorMessageEmail() }}</cos-error>
    </cos-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosFormFieldDemoComponent {
  @Input() hideRequiredMarker;
  email = new FormControl('', [Validators.required, Validators.email]);
  food = new FormControl('', [Validators.required]);

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessageFood() {
    if (this.food.hasError('required')) {
      return 'You must enter a value';
    }
  }
}
