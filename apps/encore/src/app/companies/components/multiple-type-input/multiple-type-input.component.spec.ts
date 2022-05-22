import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  MultipleTypeInputComponent,
  MultipleTypeInputComponentModule,
} from './multiple-type-input.component';

describe('MultipleTypeInputComponent', () => {
  const formGroupDirective = new FormGroupDirective([], []);

  formGroupDirective.form = new FormGroup({
    Countries: new FormControl(),
  });

  const createComponent = createComponentFactory({
    component: MultipleTypeInputComponent,
    imports: [MultipleTypeInputComponentModule],
    providers: [{ provide: ControlContainer, useValue: formGroupDirective }],
  });

  const testSetup = () => {
    const spectator = createComponent({
      props: { type: 'Countries' },
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display correct label', () => {
    // Arrange
    const { spectator } = testSetup();
    const label = 'test label';

    // Act
    spectator.setInput('label', label);

    // Assert
    expect('.cos-form-label').toHaveText(label);
  });
});
