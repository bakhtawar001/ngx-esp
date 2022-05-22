import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosCheckboxComponent } from './checkbox.component';
import { CosCheckboxModule } from './checkbox.module';

describe('CosCheckboxComponent', () => {
  let component: CosCheckboxComponent;
  let spectator: Spectator<CosCheckboxComponent>;

  const createComponent = createComponentFactory({
    component: CosCheckboxComponent,
    imports: [CosCheckboxModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send true when clicked', () => {
    const elem: any = spectator.query('.cos-checkbox-input');
    jest.spyOn(component.change, 'emit');
    spectator.click(elem);
    spectator.detectChanges();
    expect(elem).toHaveProperty('checked', true);
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('should not change on click when input is disabled', () => {
    const elem = spectator.query('.cos-checkbox-input');
    spectator.setInput('disabled', true);
    spectator.click(elem);
    spectator.detectChanges();
    expect(elem).toHaveProperty('checked', false);
  });
});
