import { By } from '@angular/platform-browser';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosClearableInputComponent } from './clearable-input.component';
import { CosClearableInputModule } from './clearable-input.module';

describe('CosClearableInput', () => {
  let fixture: any;

  let spectator: Spectator<CosClearableInputComponent>;
  const createComponent = createComponentFactory({
    component: CosClearableInputComponent,
    imports: [CosClearableInputModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    fixture = spectator.fixture;
  });

  it('should add a suffix when value is present', () => {
    expect(spectator.query('cos-form-field-suffix')).toBeNull();
    const input = fixture.debugElement.query(
      By.css('.cos-input')
    ).nativeElement;
    input.value = 'foo';
    input.dispatchEvent(new Event('input'));
    spectator.detectChanges();
    const suffix = spectator.query('.cos-form-field-suffix');
    expect(suffix).toBeTruthy();
  });

  it('should clear the input when suffix icon is clicked', async () => {
    expect(spectator.query('cos-form-field-suffix')).toBeNull();
    const input = fixture.debugElement.query(
      By.css('.cos-input')
    ).nativeElement;

    input.value = 'foo';
    input.dispatchEvent(new Event('input'));
    await spectator.detectChanges();
    const clearButton = fixture.debugElement.query(By.css('.fa-times'));
    expect(clearButton).toBeTruthy();
    clearButton.triggerEventHandler('click', null);

    await spectator.detectChanges();
    expect(input.value).toBe('');
  });
});
