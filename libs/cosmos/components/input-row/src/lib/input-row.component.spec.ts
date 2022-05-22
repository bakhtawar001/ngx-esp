import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosInputRowComponent } from './input-row.component';
import { CosInputRowModule } from './input-row.module';

describe('CosInputRowComponent', () => {
  let component: CosInputRowComponent;
  let spectator: Spectator<CosInputRowComponent>;
  const createComponent = createComponentFactory({
    component: CosInputRowComponent,
    imports: [CosInputRowModule, CosFormFieldModule, CosInputModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('container should have the hidden class if `allowDisable` is falsy', () => {
    // Arrange & act
    spectator.setInput({
      allowDisable: false,
    });

    // Assert
    expect(spectator.query('.btn-container:first-child')).toHaveClass(
      'btn-hidden'
    );
  });

  it('icon should have diffent classes considering the `disabled` binding', () => {
    // Arrange & act
    spectator.setInput({
      disabled: false,
    });

    const icon = spectator.query('.btn-container:first-child button i');
    // Assert
    expect(icon).toHaveClass('fa fa-eye');

    spectator.setInput({
      disabled: true,
    });

    expect(icon).toHaveClass('fa fa-eye-slash cos-toggle-button-on');
  });
});
