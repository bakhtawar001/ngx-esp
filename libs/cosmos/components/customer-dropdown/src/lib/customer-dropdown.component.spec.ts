import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosCustomerDropdownComponent } from './customer-dropdown.component';
import { CosCustomerDropdownModule } from './customer-dropdown.module';

describe('CosCustomerDropdownComponent', () => {
  let component: CosCustomerDropdownComponent;
  let spectator: Spectator<CosCustomerDropdownComponent>;
  const createComponent = createComponentFactory({
    component: CosCustomerDropdownComponent,
    imports: [CosCustomerDropdownModule],
    declarations: [CosCustomerDropdownComponent],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        customers: [],
        dropdownLabel: 'Customer',
        newCustomerButtonLabel: 'Create new customer',
        selectedCustomerId: null,
      },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });
});
