import {
  AsiCompanyFormComponent,
  AsiCompanyFormComponentModule,
  AsiCompanyFormService,
} from '@asi/company/ui/feature-forms';
import { ConfirmDialogService } from '@asi/ui/feature-core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CompaniesService } from '@esp/companies';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';
import {
  AsiProjectCreateCustomerFormComponent,
  AsiProjectCreateCustomerFormModule,
} from './project-create-customer-form.component';

describe('AsiProjectCreateCustomerFormComponent', () => {
  let spectator: Spectator<AsiProjectCreateCustomerFormComponent>;
  let component: AsiProjectCreateCustomerFormComponent;

  const createComponent = createComponentFactory({
    component: AsiProjectCreateCustomerFormComponent,
    imports: [AsiProjectCreateCustomerFormModule],
    providers: [
      MockProvider(CompaniesService),
      MockProvider(ConfirmDialogService),
      MockProvider(AsiCompanyFormService),
    ],
    overrideModules: [
      [
        AsiCompanyFormComponentModule,
        {
          set: {
            declarations: [MockComponent(AsiCompanyFormComponent)],
            exports: [MockComponent(AsiCompanyFormComponent)],
          },
        },
      ],
    ],
    detectChanges: false,
  });

  const testSetup = () => {
    spectator = createComponent();
    component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should display asi-company-form', () => {
    const { spectator } = testSetup();

    expect(spectator.query('asi-company-form')).toBeTruthy();
  });
});
