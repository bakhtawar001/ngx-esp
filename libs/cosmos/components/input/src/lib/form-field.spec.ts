import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosInputModule } from '@cosmos/components/input';
import { CosFormFieldModule } from '@cosmos/components/form-field';

@Component({
  selector: 'cos-test-formfield-component',

  template: `
    <cos-form-field>
      <cos-label>Favorite Food</cos-label>
      <input cos-input #input maxlength="10" [formControl]="food" />

      <i cosPrefix class="fas fa-search"></i>
      <i cosSuffix class="fas fa-times"></i>
      <cos-error
        *ngIf="food.invalid"
        [controlErrors]="{ required: getErrorMessageFood() }"
      ></cos-error>
      <cos-hint>Max 10 characters</cos-hint>
      <cos-hint align="end">{{ input.value?.length || 0 }}/10</cos-hint>
    </cos-form-field>
  `,
})
class TestFormFieldComponent {
  food = new FormControl('', [Validators.required]);
  getErrorMessageFood() {
    if (this.food.hasError('required')) {
      return 'You must enter a value';
    } else {
      return null;
    }
  }
}

describe('CosFormFieldComponent', () => {
  let fixture: ComponentFixture<TestFormFieldComponent>;

  let spectator: Spectator<TestFormFieldComponent>;
  const createComponent = createComponentFactory({
    component: TestFormFieldComponent,
    imports: [CosFormFieldModule, CosInputModule, ReactiveFormsModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = spectator.fixture;
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should render a cosPrefix element', () => {
    expect(spectator.query('.cos-form-field-prefix')).toBeTruthy();
    expect(spectator.query('.fa-search')).toBeTruthy();
  });

  it('should render a cosSuffix element', () => {
    const suffixElem = spectator.query('.cos-form-field-suffix');
    const faElem = spectator.query('.fa-search');

    expect(suffixElem).toBeTruthy();

    // should render the element inside the suffix parent
    expect(faElem).toBeTruthy();
  });

  it('should be able to check whether form-field is disabled', () => {
    const compiled = fixture.debugElement.nativeElement;
    const elem = compiled.querySelector('.cos-input');

    fixture.detectChanges();

    expect(elem.checked).toBeFalsy();
  });

  it('should set the value of the input', async () => {
    const compiled = fixture.debugElement.nativeElement;
    const elem = compiled.querySelector('.cos-input');

    elem.value = 'Taco';
    elem.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(elem.value).toBe('Taco');
  });

  it('should display hint label text', async () => {
    const elem = spectator?.queryAll('.cos-hint');

    expect(elem[0].textContent?.trim()).toBe('Max 10 characters');
  });

  it('should display hint value example and increment value as text size increases', async () => {
    const compiled = fixture.debugElement.nativeElement;
    const elem = compiled.querySelectorAll('.cos-hint');
    const inputElem = compiled.querySelector('.cos-input');

    expect(elem[1].textContent.trim()).toBe('0/10');

    inputElem.value = 'Taco';
    inputElem.dispatchEvent(new Event('input'));

    spectator.detectChanges();

    expect(elem[1].textContent.trim()).toBe('4/10');
  });

  it('should display error message when required', async () => {
    const compiled = fixture.debugElement.nativeElement;
    const inputElem = compiled.querySelector('.cos-input');
    inputElem.value = '';
    inputElem.dispatchEvent(new Event('focus'));
    inputElem.dispatchEvent(new Event('blur'));

    spectator.detectChanges();
    const errorMsg = compiled.querySelector('.cos-error');

    expect(errorMsg.textContent.trim()).toBe('You must enter a value');
  });
});
