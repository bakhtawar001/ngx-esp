import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CosToastService } from '@cosmos/components/notification';
import { dataCySelector } from '@cosmos/testing';
import { EspLookupSelectComponent } from '@esp/lookup-types';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { CompanyDetailLocalState } from '../../local-states';
import {
  CompanyDetailComponent,
  CompanyDetailComponentModule,
} from './company-detail.component';
import {
  AsiLinkedCompaniesPanelFormComponent,
  AsiLinkedCompaniesPanelFormModule,
  AsiLinkedCompaniesFormComponent,
  AsiLinkedCompaniesFormModule,
} from '@asi/company/ui/feature-components';
import { MockComponent } from 'ng-mocks';

const selectors = {
  sectionRow: '.settings-main-content > p',
  companyDetails: {
    header: dataCySelector('company-details') + ' .header-style-16',
    section: dataCySelector('company-details'),
    panel: dataCySelector('company-details') + ' cos-segmented-panel-row',
  },
  contactInformation: {
    section: dataCySelector('contact-information'),
    panel: dataCySelector('contact-information') + ' cos-segmented-panel-row',
  },
  financialDetails: {
    section: dataCySelector('financial-details'),
    panel: dataCySelector('financial-details') + ' cos-segmented-panel-row',
    defaultTermsPanel: dataCySelector('default-terms-panel'),
    taxPanel: dataCySelector('tax-panel'),
    salesTargetPanel: dataCySelector('sales-target-panel'),
    minimumMarginPanel: dataCySelector('minimum-margin-panel'),
  },
};

describe('CompanyDetailComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanyDetailComponent,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      CompanyDetailComponentModule,
    ],
    providers: [mockProvider(CosToastService)],
    overrideModules: [
      [
        AsiLinkedCompaniesPanelFormModule,
        {
          set: {
            declarations: [MockComponent(AsiLinkedCompaniesPanelFormComponent)],
            exports: [MockComponent(AsiLinkedCompaniesPanelFormComponent)],
          },
        },
      ],
      [
        AsiLinkedCompaniesFormModule,
        {
          set: {
            declarations: [MockComponent(AsiLinkedCompaniesFormComponent)],
            exports: [MockComponent(AsiLinkedCompaniesFormComponent)],
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    IsCustomer?: boolean;
    IsDecorator?: boolean;
    IsSupplier?: boolean;
  }) => {
    const stateMock = {
      company: {
        PrimaryBrandColor: '#fffff',
      },
      party: {
        Addresses: [],
        Collaborators: [],
        IsCustomer: options?.IsCustomer,
        IsSupplier: options?.IsSupplier,
        OwnerId: 0,
        PrimaryBrandColor: '#fffff',
      },
      partyLookups: { CreditTerms: [] },
      partyIsReady: true,
    };
    const companyDetailLocalStateMock = {
      connect: () => of(stateMock),
      ...stateMock,
    };
    const spectator = createComponent({
      providers: [
        mockProvider(CompanyDetailLocalState, companyDetailLocalStateMock),
        {
          provide: PARTY_LOCAL_STATE,
          useValue: companyDetailLocalStateMock,
        },
      ],
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Company Detail section', () => {
    it('should have company detail header', () => {
      const { spectator } = testSetup();

      expect(spectator.query(selectors.companyDetails.header)).toHaveText(
        'Company & Brand Information'
      );
    });

    it("Company Display Name, Company Type, Company Logo, Favicon and Company Color are viewable in a section called 'Company & Brand Information'", () => {
      const { spectator } = testSetup();
      const panelRows = spectator.queryAll(selectors.companyDetails.panel);

      expect(panelRows.length).toEqual(5);
      expect(panelRows[0].querySelector(selectors.sectionRow)).toHaveText(
        'Company Display Name'
      );
      expect(panelRows[1].querySelector(selectors.sectionRow)).toHaveText(
        'Company Type'
      );
      expect(panelRows[2].querySelector(selectors.sectionRow)).toHaveText(
        'Company Logo'
      );
      expect(panelRows[3].querySelector(selectors.sectionRow)).toHaveText(
        'Favicon'
      );
      expect(panelRows[4].querySelector(selectors.sectionRow)).toHaveText(
        'Company Color'
      );
    });
  });

  describe('Contact Information section', () => {
    it('should have contact information header', () => {
      //Arrange
      const { spectator } = testSetup();

      //Assert
      expect(spectator.query(selectors.contactInformation.section)).toHaveText(
        'Contact Information'
      );
    });

    it('should display panels', () => {
      const { spectator } = testSetup();
      const panelRows = spectator.queryAll(selectors.contactInformation.panel);

      expect(panelRows.length).toEqual(4);
      expect(panelRows[0].querySelector(selectors.sectionRow)).toHaveText(
        'Email'
      );
      expect(panelRows[1].querySelector(selectors.sectionRow)).toHaveText(
        'Telephone Numbers'
      );
      expect(panelRows[2].querySelector(selectors.sectionRow)).toHaveText(
        'Websites'
      );
      expect(panelRows[3].querySelector(selectors.sectionRow)).toHaveText(
        'Social Media'
      );
    });

    it('should display Office Phone as default phone type', () => {
      const { spectator } = testSetup();
      const button = spectator.query(
        'esp-phone-list-panel-row-form > asi-panel-editable-row > .settings-two-col-2 > [data-cy=action-button]'
      );
      spectator.click(button);
      const espLookupSelectComponent =
        spectator.query<EspLookupSelectComponent>(EspLookupSelectComponent);

      expect(espLookupSelectComponent.value).toBe('Office');
    });
  });

  describe('Financial details section', () => {
    it('should show given panels (Minimum Margin, Sales Target, Tax, Default Terms) for company type customer', () => {
      const { spectator } = testSetup({ IsCustomer: true });

      expect(spectator.query(selectors.financialDetails.section)).toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.defaultTermsPanel)
      ).toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.taxPanel)
      ).toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.salesTargetPanel)
      ).toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.minimumMarginPanel)
      ).toBeVisible();

      const panels = spectator.queryAll(selectors.financialDetails.panel);
      expect(panels.length).toBe(4);
      expect(panels[0]).toHaveText('Default Terms');
      expect(panels[1]).toHaveText('Tax');
      expect(panels[2]).toHaveText('Sales Target');
      expect(panels[3]).toHaveText('Default Margin');
    });

    it('should show given panels (Default Terms) for company type supplier', () => {
      const { spectator } = testSetup({ IsSupplier: true });

      expect(spectator.query(selectors.financialDetails.section)).toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.taxPanel)
      ).not.toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.minimumMarginPanel)
      ).not.toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.salesTargetPanel)
      ).not.toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.defaultTermsPanel)
      ).toBeVisible();

      const panels = spectator.queryAll(selectors.financialDetails.panel);
      expect(panels.length).toBe(1);
      expect(panels[0]).toHaveText('Default Terms');
    });

    it('should show given panels (Default Terms) for company type decorator', () => {
      const { spectator } = testSetup({ IsSupplier: true });

      expect(spectator.query(selectors.financialDetails.section)).toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.taxPanel)
      ).not.toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.minimumMarginPanel)
      ).not.toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.salesTargetPanel)
      ).not.toBeVisible();
      expect(
        spectator.query(selectors.financialDetails.defaultTermsPanel)
      ).toBeVisible();

      const panels = spectator.queryAll(selectors.financialDetails.panel);
      expect(panels.length).toBe(1);
      expect(panels[0]).toHaveText('Default Terms');
    });

    it('should not be visible for company type not customer and company type not supplier and company type not decorator', () => {
      const { spectator } = testSetup({
        IsCustomer: false,
        IsDecorator: false,
        IsSupplier: false,
      });

      expect(
        spectator.query(selectors.financialDetails.section)
      ).not.toBeVisible();
    });
  });
});
