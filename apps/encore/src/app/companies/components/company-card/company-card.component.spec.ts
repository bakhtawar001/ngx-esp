import {
  AsiCompanyActionsItemsComponent,
  AsiCompanyActionsItemsModule,
} from '@asi/company/ui/feature-components';
import { CompanySearch } from '@esp/models';
import { CompaniesSearchMockDb } from '@esp/__mocks__/companies';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { MockComponents } from 'ng-mocks';
import { AddressDisplayComponentModule } from '../../../directory/components/address-display';
import { AddressDisplayComponent } from '../../../directory/components/address-display/address-display.component';
import {
  RecordOwnerComponent,
  RecordOwnerComponentModule,
} from '../../../directory/components/record-owner/record-owner.component';
import {
  CompanyCardComponent,
  CompanyCardComponentModule,
} from './company-card.component';

describe('CompanyCardComponent', () => {
  const company: CompanySearch =
    CompaniesSearchMockDb.SearchResponse.Results[0];

  const AcknowledgementContact = {
    Id: 0,
    Name: 'John Doe',
    Email: '',
    Phone: '',
    IsPerson: false,
    IsCompany: true,
  };

  const testSetup = (props?: any) => {
    const spectator = createComponent({
      props: { company: { ...company, ...(props?.company ?? {}) } },
    });
    return { component: spectator.component, spectator };
  };

  const createComponent = createComponentFactory({
    component: CompanyCardComponent,
    imports: [CompanyCardComponentModule],
    overrideModules: [
      [
        AsiCompanyActionsItemsModule,
        {
          set: {
            declarations: MockComponents(AsiCompanyActionsItemsComponent),
            exports: MockComponents(AsiCompanyActionsItemsComponent),
          },
        },
      ],
      [
        AddressDisplayComponentModule,
        {
          set: {
            declarations: MockComponents(AddressDisplayComponent),
            exports: MockComponents(AddressDisplayComponent),
          },
        },
      ],
      [
        RecordOwnerComponentModule,
        {
          set: {
            declarations: MockComponents(RecordOwnerComponent),
            exports: MockComponents(RecordOwnerComponent),
          },
        },
      ],
    ],
  });

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should show active status when set', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.company.IsActive = true;
    spectator.detectComponentChanges();
    const section = spectator.queryAll('.party-status');

    // Assert
    expect(section).toHaveText('Active');
  });

  it('should show inactive status when set', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.company.IsActive = false;
    spectator.detectComponentChanges();
    const section = spectator.queryAll('.party-status');

    // Assert
    expect(section).toHaveText('Inactive');
  });

  it('should show created date', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.company.CreateDate = new Date(2020, 0, 1, 12, 0, 0, 0).toString();
    spectator.detectComponentChanges();
    const section = spectator.queryAll('.party-created');

    // Assert
    expect(section).toHaveText('Created Date: January 1, 2020');
  });

  describe('client contact', () => {
    it('should show - for values when not provided', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.company.AcknowledgementContact = null;
      spectator.detectComponentChanges();
      const section = spectator.queryAll('.contact-acknowledgement__no-value');

      // Assert
      expect(section).toExist();
    });

    it('should show email when provided', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const email = 'email@email.com';

      // Act
      component.company.AcknowledgementContact = {
        ...AcknowledgementContact,
        Email: email,
      };
      spectator.detectComponentChanges();
      const section = spectator.queryAll('.contact-acknowledgement-email');

      // Assert
      expect(section).toContainText(email);
    });

    it('should show phone when provided', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const phone = '5555555';

      // Act
      component.company.AcknowledgementContact = {
        ...AcknowledgementContact,
        Phone: phone,
      };
      spectator.detectComponentChanges();
      const section = spectator.queryAll('.contact-acknowledgement-phone');

      // Assert
      expect(section).toContainText(phone);
    });
  });

  it('should display company name', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const nameEl = spectator.query('.party-name > span');

    //Assert
    expect(nameEl).toContainText(component.company.Name);
    expect(nameEl).toHaveClass('ellipsis');
  });

  describe('show icon when  when a favicon has not been selected', () => {
    it('should display default icon', () => {
      // Arrange
      const { component, spectator } = testSetup({
        company: { IconImageUrl: '' },
      });

      //Act
      spectator.setInput({
        company: {
          ...component.company,
          Types: [''],
        },
      });
      component.ngOnInit();
      spectator.detectComponentChanges();

      const icon = spectator.query('.avatar-icon.fa');

      //Assert
      expect(icon).toBeVisible();
      expect(icon).toHaveClass('fa-building');
    });

    it('should display users icons if only Customer selected', () => {
      // Arrange
      const { component, spectator } = testSetup({
        company: { IconImageUrl: '' },
      });

      //Act
      spectator.setInput({
        company: {
          ...component.company,
          Types: ['Customer'],
        },
      });
      component.ngOnInit();
      spectator.detectComponentChanges();
      const icon = spectator.query('.avatar-icon.fa');

      //Assert
      expect(icon).toBeVisible();
      expect(component.iconClass).toContain('users');
      expect(icon).toHaveClass('fa-users');
    });

    it('should display palette icons if only Decorator selected', () => {
      // Arrange
      const { component, spectator } = testSetup({
        company: { IconImageUrl: '' },
      });

      //Act
      spectator.setInput({
        company: {
          ...component.company,
          Types: ['Decorator'],
        },
      });
      component.ngOnInit();
      spectator.detectComponentChanges();
      const icon = spectator.query('.avatar-icon.fa');

      //Assert
      expect(icon).toBeVisible();
      expect(component.iconClass).toContain('palette');
      expect(icon).toHaveClass('fa-palette');
    });

    it('should display industry icons if only Supplier selected', () => {
      // Arrange
      const { component, spectator } = testSetup({
        company: { IconImageUrl: '' },
      });

      //Act
      spectator.setInput({
        company: {
          ...component.company,
          Types: ['Supplier'],
        },
      });
      component.ngOnInit();
      spectator.detectComponentChanges();
      const icon = spectator.query('.avatar-icon.fa');

      //Assert
      expect(icon).toBeVisible();
      expect(component.iconClass).toContain('industry');
      expect(icon).toHaveClass('fa-industry');
    });

    it('should display building icons if more than one company type selected', () => {
      // Arrange
      const { component, spectator } = testSetup({
        company: { IconImageUrl: '' },
      });

      //Act
      spectator.setInput({
        company: {
          ...component.company,
          Types: ['Supplier', 'Customer'],
        },
      });
      component.ngOnInit();
      spectator.detectComponentChanges();
      const icon = spectator.query('.avatar-icon.fa');

      //Assert
      expect(icon).toBeVisible();
      expect(component.iconClass).toContain('building');
      expect(icon).toHaveClass('fa-building');
    });
  });
});
