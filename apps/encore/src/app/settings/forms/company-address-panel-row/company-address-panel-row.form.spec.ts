import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  CosAddressFormComponent,
  CosAddressFormModule,
} from '@cosmos/components/address-form';
import { AuthFacade } from '@esp/auth';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import {
  CompanyAddressPanelRowForm,
  CompanyAddressPanelRowFormModule,
} from './company-address-panel-row.form';

describe('CompanyAddressPanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: CompanyAddressPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      CompanyAddressPanelRowFormModule,
    ],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          hasRole: jest.fn(() => true),
        },
      }),
    ],
    overrideModules: [
      [
        CosAddressFormModule,
        {
          set: {
            declarations: MockComponents(CosAddressFormComponent),
            exports: MockComponents(CosAddressFormComponent),
          },
        },
      ],
    ],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display the row icon correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const rowIcon = spectator.query('.form-row-icon');

    // Assert
    expect(rowIcon).toExist();
    expect(rowIcon).toHaveClass('fa fa-map-marker-alt');
  });

  it("should display 'No address currently set.' text when value is not set", () => {
    // Arrange
    const { spectator } = testSetup();
    const rowValue = spectator.query('.form-row-value');

    // Assert
    expect(rowValue).toExist();
    expect(rowValue).toHaveText('No address currently set.');
  });
});
