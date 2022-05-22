import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SuppliersMockDb } from '@smartlink/suppliers/mocks';
import { CosSupplierPageHeaderComponent } from './supplier-page-header.component';
import { CosSupplierPageHeaderModule } from './supplier-page-header.module';

describe('CosSupplierPageHeaderComponent', () => {
  let component: CosSupplierPageHeaderComponent;
  let spectator: Spectator<CosSupplierPageHeaderComponent>;

  const createComponent = createComponentFactory({
    component: CosSupplierPageHeaderComponent,
    imports: [BrowserAnimationsModule, CosSupplierPageHeaderModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        supplier: SuppliersMockDb.suppliers[0],
        labels: {
          addTo: 'Add to',
          artwork: 'Artwork',
          awards: 'Awards',
          contacts: 'Company Contacts',
          contactInfo: 'Contact Information',
          details: 'Supplier Details',
          email: 'Send a message',
          headquarters: 'Headquarters',
          orders: 'Orders',
          preferredSupplier: 'Preferred Supplier Group',
          preferredPricing: 'Preferred Pricing',
          references: 'Independent Distributor References',
          tollFree: 'Toll Free',
          viewMore: 'View more information',
          viewLess: 'View less information',
          yearEstablished: 'Year Established',
          yearsInIndustry: 'Years in Industry',
          totalEmployees: 'Total Employees',
          qca: 'QCA Certified',
          minorityOwned: 'Minority Owned',
          unionAffiliated: 'Union Affiliated',
          standardProductionTime: 'Standard Production Time',
          rushTime: 'Rush Time',
          functions: 'Functions',
          decoratingMethods: 'Decorating Methods',
          fobPoints: 'FOB/Shipping Point(s)',
          artworkComments: 'Artwork Comments',
          marketingPolicy: 'Marketing Policy',
          distributionPolicy: 'Distribution Policy',
          safetyCompliance: 'Safety and Compliance documents',
          webPages: 'Web Pages',
          notes: 'Notes',
          addANote: 'Add a note',
          true: 'Yes',
          false: 'No',
          exceptions: 'Esceptions',
        },
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add text to various nodes from data object (spot-check)', () => {
    const supplierName = spectator.queryAll('.cos-supplier-name');
    const asiNumber = spectator.queryAll('.cos-supplier-number');
    expect(supplierName[0].textContent?.trim()).toBe('Snugz/USA Inc');
    expect(asiNumber[0].textContent?.trim()).toBe('asi/88060');
  });

  it('should add text to various nodes from labels object (spot-check)', () => {
    component.labels.awards = 'Awards';
    spectator.detectComponentChanges();
    const subhead = spectator.queryAll('.cos-supplier-subhead');
    expect(subhead[1].textContent?.trim()).toBe(component.labels.awards);
  });

  it('should display correct cos supplier our story', () => {
    component.supplier.OurStory = 'Our Story!';
    spectator.detectComponentChanges();
    const ourStory = spectator.queryAll('.cos-supplier-our-story');
    expect(ourStory[0].textContent?.trim()).toBe(component.supplier.OurStory);
  });

  it('should not display cos supplier our story', () => {
    component.supplier.OurStory = null;
    spectator.detectComponentChanges();
    const ourStory = spectator.query('.cos-supplier-our-story');
    expect(ourStory).toBeFalsy();
  });

  it('should not display cos supplier Awards', () => {
    component.supplier.Awards = [];
    spectator.detectComponentChanges();
    const ourStory = spectator.query('.cos-supplier-awards');
    expect(ourStory).toBeFalsy();
  });

  it('should display correct cos supplier awards', () => {
    component.supplier.Awards = ['Award 1', 'Award 2', 'Award 3'];
    spectator.detectComponentChanges();
    const awards = spectator.queryAll('.cos-award');
    awards.forEach((award, index) => {
      expect(award.textContent?.trim()).toBe(component.supplier.Awards[index]);
    });
  });

  it('should not display cos supplier preferred values', () => {
    component.supplier.Preferred = null;
    spectator.detectComponentChanges();
    const preferred = spectator.query('.cos-supplier-preferred');
    expect(preferred).toBeFalsy();
  });

  it('should display correct cos supplier preferred name', () => {
    component.supplier.Preferred.Name = 'Supplier Preferred Name';
    spectator.detectComponentChanges();
    const name = spectator.queryAll('.cos-supplier-preferred-name');
    expect(name[0].textContent?.trim()).toBe(component.supplier.Preferred.Name);
  });

  it('should not show supplier functions', () => {
    component.supplier.Functions = [];
    spectator.detectComponentChanges();
    const supplierFunctions = spectator.query(
      '.cos-supplier-detail > .cos-supplier-function'
    );
    expect(supplierFunctions).toBeFalsy();
  });

  it('should show correct supplier functions label', () => {
    component.labels.functions = 'Label Functions';
    spectator.detectComponentChanges();
    const supplierFunctionLabel = spectator.query(
      '.cos-supplier-detail > .cos-supplier-function'
    );
    expect(supplierFunctionLabel?.textContent?.trim()).toEqual(
      component.labels.functions
    );
  });

  it('should show correct supplier funtion values', () => {
    component.supplier.Functions = ['Function 1', 'Function 2'];
    spectator.detectComponentChanges();
    const supplierFunctionValue = spectator.query(
      '.cos-supplier-detail > .cos-supplier-function-value'
    );
    const expectedsupplierFunctionValue =
      component.supplier.Functions.join(', ');
    expect(supplierFunctionValue?.textContent?.trim()).toEqual(
      expectedsupplierFunctionValue
    );
  });

  it('should not show supplier Imprinting methods', () => {
    component.supplier.ImprintingMethods = [];
    spectator.detectComponentChanges();
    const supplierFunctions = spectator.query(
      '.cos-supplier-detail > .cos-supplier-imprinting-method'
    );
    expect(supplierFunctions).toBeFalsy();
  });

  it('should show correct supplier Decorating methods label', () => {
    component.labels.decoratingMethods = 'Label Decorating Methods';
    spectator.detectComponentChanges();
    const imprintingFunctionLabel = spectator.query(
      '.cos-supplier-detail > .cos-supplier-imprinting-method'
    );
    expect(imprintingFunctionLabel?.textContent?.trim()).toEqual(
      component.labels.decoratingMethods
    );
  });

  it('should show correct supplier Decorating methods values', () => {
    component.supplier.ImprintingMethods = ['Method 1', 'Method 2', 'Method 3'];
    spectator.detectComponentChanges();
    const imprintingFunctionValue = spectator.query(
      '.cos-supplier-detail > .cos-supplier-imprinting-method-value'
    );
    const expectedimprintingFunctionValue =
      component.supplier.ImprintingMethods.join(', ');
    expect(imprintingFunctionValue?.textContent?.trim()).toEqual(
      expectedimprintingFunctionValue
    );
  });

  it('should not show supplier fobPoints', () => {
    component.supplier.ShippingPoints = [];
    spectator.detectComponentChanges();
    const supplierfobPoints = spectator.query(
      '.cos-supplier-detail > .cos-supplier-fobPoints'
    );
    expect(supplierfobPoints).toBeFalsy();
  });

  it('should show correct supplier fobPoints label', () => {
    component.labels.fobPoints = 'Label FOB Points';
    spectator.detectComponentChanges();
    const fobPointsFunctionLabel = spectator.query(
      '.cos-supplier-detail > .cos-supplier-fobPoints'
    );
    expect(fobPointsFunctionLabel?.textContent?.trim()).toEqual(
      component.labels.fobPoints
    );
  });

  it('should show correct supplier Imprinting methods values', () => {
    const fobPointsFunctionValue = spectator.query(
      '.cos-supplier-detail > .cos-supplier-fobPoints-value'
    );
    const expectedfobPointsFunctionValue = component.fobPoints.join('; ');
    expect(fobPointsFunctionValue?.textContent?.trim()).toEqual(
      expectedfobPointsFunctionValue
    );
  });

  it('should not show supplier Artwork comments', () => {
    component.supplier.Artwork = [];
    spectator.detectComponentChanges();
    const supplierArtwork = spectator.query(
      '.cos-supplier-detail > .cos-supplier-artwork'
    );
    expect(supplierArtwork).toBeFalsy();
  });

  it('should show correct supplier Artwork comments label', () => {
    component.labels.artworkComments = 'Artwork Comments';
    spectator.detectComponentChanges();
    const artworkFunctionLabel = spectator.query(
      '.cos-supplier-detail > .cos-supplier-artwork'
    );
    expect(artworkFunctionLabel?.textContent?.trim()).toEqual(
      component.labels.artworkComments
    );
  });

  it('should show correct supplier Artwork comment', () => {
    component.supplier.Artwork.Comment = 'Artwork Comment';
    spectator.detectComponentChanges();
    const artworkFunctionValue = spectator.query(
      '.cos-supplier-detail > .cos-supplier-artwork-value'
    );
    const expectedartworkValue = component.supplier.Artwork.Comment;
    expect(artworkFunctionValue?.textContent?.trim()).toEqual(
      expectedartworkValue
    );
  });

  it('should not show supplier Marketing Policy', () => {
    component.supplier.MarketingPolicy = null;
    spectator.detectComponentChanges();

    expect('.cos-supplier-market-policy-value').not.toExist();
  });

  it('should show correct supplier Marketing Policy label', () => {
    component.labels.marketingPolicy = 'Market Policies';
    spectator.detectComponentChanges();
    const marketingPolicyLabel = spectator.query(
      '.cos-supplier-market-policy.cos-supplier-subhead'
    );
    expect(marketingPolicyLabel?.textContent?.trim()).toEqual(
      component.labels.marketingPolicy
    );
  });

  it('should show correct supplier Marketing Policy', () => {
    component.supplier.MarketingPolicy = 'Supplier Market Policy';
    spectator.detectComponentChanges();
    const marketingPolicyValue = spectator.query(
      '.cos-supplier-market-policy-value'
    );
    const expectedmarketingPolicyValue = component.supplier.MarketingPolicy;
    expect(marketingPolicyValue?.textContent?.trim()).toEqual(
      expectedmarketingPolicyValue
    );
  });

  it('should not show supplier Distribution Policy', () => {
    component.supplier.DistributionPolicy = null;
    spectator.detectComponentChanges();
    const supplierDistributionPolicy = spectator.query(
      '.cos-supplier-detail > .cos-supplier-distribution-policy'
    );
    expect(supplierDistributionPolicy).toBeFalsy();
  });

  it('should show correct supplier Distribution Policy label', () => {
    component.labels.distributionPolicy = 'Label Distribution Policy';
    spectator.detectComponentChanges();
    const distributionPolicyLabel = spectator.query(
      '.cos-supplier-detail > .cos-supplier-distribution-policy'
    );
    expect(distributionPolicyLabel?.textContent?.trim()).toEqual(
      component.labels.distributionPolicy
    );
  });

  it('should show correct supplier Distribution Policy', () => {
    component.supplier.DistributionPolicy = 'Supplier Distribution Policy';
    spectator.detectComponentChanges();
    const distributionPolicyValue = spectator.query(
      '.cos-supplier-detail > .cos-supplier-distribution-policy-value'
    );
    const expecteddistributionPolicyValue =
      component.supplier.DistributionPolicy;
    expect(distributionPolicyValue?.textContent?.trim()).toEqual(
      expecteddistributionPolicyValue
    );
  });

  it('should not show Safety Compliance Documents', () => {
    component.supplier.Documentations = null;
    spectator.detectComponentChanges();
    const supplierComplianceDocuments = spectator.query(
      '.cos-supplier-detail > .cos-supplier-documents'
    );
    expect(supplierComplianceDocuments).toBeFalsy();
  });

  it('should show correct Safety Compliance Documents label', () => {
    component.labels.safetyCompliance = 'Safety Compliance Rules';
    spectator.detectComponentChanges();
    const complianceDocumentsLabel = spectator.query(
      '.cos-supplier-detail > .cos-supplier-documents'
    );
    expect(complianceDocumentsLabel?.textContent?.trim()).toEqual(
      component.labels.safetyCompliance
    );
  });

  it('should show correct Safety Compliance Document with no Web pages', () => {
    component.supplier.Documentations = [
      {
        Id: 221,
        Name: 'To access: User: snugz, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'MEDI',
      },
      {
        Id: 221,
        Name: 'To access: User: snugz, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'LINK',
      },
    ];
    component.supplier.Documentations = component.documentationsFilter('MEDI');
    spectator.detectComponentChanges();
    const complianceDocuments = spectator.queryAll(
      '.cos-supplier-detail > .cos-supplier-doc-list > .cos-supplier-detail-value'
    );
    expect(complianceDocuments[0].textContent?.trim()).toEqual(
      component.supplier.Documentations[0].Name
    );
  });

  it('should show correct multiple Safety Compliance Documents in the form of a list with no web pages', () => {
    component.supplier.Documentations = [
      {
        Id: 221,
        Name: 'To access: User: snugz, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'MEDI',
      },
      {
        Id: 222,
        Name: 'To access: User: abcd, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'MEDI',
      },
    ];
    component.supplier.Documentations = component.documentationsFilter('MEDI');
    spectator.detectComponentChanges();
    const complianceDocuments = spectator.queryAll(
      '.cos-supplier-detail > .cos-supplier-doc-list > .cos-supplier-detail-value'
    );
    expect(complianceDocuments[0].textContent?.trim()).toEqual(
      component.supplier.Documentations[0].Name
    );
    expect(complianceDocuments[1].textContent?.trim()).toEqual(
      component.supplier.Documentations[1].Name
    );
  });

  it('should show correct Web Pages with no Safety Compliance Documents', () => {
    component.supplier.Documentations = [
      {
        Id: 221,
        Name: 'To access: User: snugz, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'LINK',
      },
      {
        Id: 221,
        Name: 'To access: User: snugz, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'MEDI',
      },
    ];
    component.supplier.Documentations = component.documentationsFilter('LINK');
    spectator.detectComponentChanges();
    const webPages = spectator.queryAll(
      '.cos-supplier-detail > .cos-supplier-doc-list > .cos-supplier-detail-value'
    );
    expect(webPages[0].textContent?.trim()).toEqual(
      component.supplier.Documentations[0].Name
    );
  });

  it('should show correct multiple Web Pages in the form of a list with Safety Compliance Documents', () => {
    component.supplier.Documentations = [
      {
        Id: 221,
        Name: 'To access: User: snugz, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'LINK',
      },
      {
        Id: 222,
        Name: 'To access: User: abcd, password: user2010',
        Url: 'http://www.snugzusa.com/testing_compliance.asp',
        Type: 'MEDI',
      },
    ];
    component.supplier.Documentations = component.documentationsFilter('LINK');
    spectator.detectComponentChanges();
    const webPages = spectator.queryAll(
      '.cos-supplier-detail > .cos-supplier-doc-list > .cos-supplier-detail-value'
    );
    expect(webPages[0].textContent?.trim()).toEqual(
      component.supplier.Documentations[0].Name
    );
  });

  it('should not show Safety Web pages', () => {
    component.supplier.Documentations = null;
    spectator.detectComponentChanges();
    const supplierSafetyWebPages = spectator.query(
      '.cos-supplier-detail > .cos-supplier-webPages'
    );
    expect(supplierSafetyWebPages).toBeFalsy();
  });

  it('should show correct Safety Web pages', () => {
    const safetyWebPagesLabel = spectator.query(
      '.cos-supplier-detail > .cos-supplier-webPages'
    );
    expect(safetyWebPagesLabel?.textContent?.trim()).toEqual(
      component.labels.webPages
    );
  });

  describe('is Union Affiliated', () => {
    it('should show correct value', () => {
      component.supplier.IsUnionAvailable = true;
      spectator.detectComponentChanges();
      const isUnionAffiliated = spectator.query(
        '.cos-supplier-detail > .cos-supplier-isUnion'
      );
      expect(isUnionAffiliated?.textContent?.trim()).toEqual(
        component.labels[component.supplier.IsUnionAvailable]
      );
    });

    it('should not be shown', () => {
      expect(
        spectator.query('.cos-supplier-detail > .cos-supplier-isUnion')
      ).toBeFalsy();
    });
  });

  describe('is Minority Owned', () => {
    it('should not be shown', () => {
      expect(
        spectator.query('.cos-supplier-detail > .cos-supplier-isMinority')
      ).toBeFalsy();
    });

    it('should show correct value', () => {
      component.supplier.IsMinorityOwned = true;
      delete component.supplier.MinorityInvolvement;
      spectator.detectComponentChanges();
      const isMinorityOwned = spectator.query(
        '.cos-supplier-detail > .cos-supplier-isMinority'
      );
      expect(isMinorityOwned?.textContent?.trim()).toEqual(
        component.labels[component.supplier.IsMinorityOwned]
      );
    });

    it('should not display cos supplier minority involvement', () => {
      component.supplier.MinorityInvolvement = null;
      spectator.detectComponentChanges();
      const minority = spectator.query('.cos-supplier-minority-involvement');
      expect(minority).toBeFalsy();
    });

    it('should show the correct minority involvement', () => {
      component.supplier.IsMinorityOwned = true;
      component.supplier.MinorityInvolvement = 'Veteran';
      spectator.detectComponentChanges();
      const isMinorityOwned = spectator.query(
        '.cos-supplier-detail > .cos-supplier-minority-involvement'
      );
      expect(isMinorityOwned?.textContent?.trim()).toEqual(
        component.supplier.MinorityInvolvement
      );
    });
  });

  describe('is QCA cerified', () => {
    it('should not display cos supplier certifications', () => {
      component.supplier.IsQcaCertified = null;
      spectator.detectComponentChanges();
      const certificates = spectator.query('.cos-supplier-certified');
      expect(certificates).toBeFalsy();
    });

    it('should be displayed correctly', () => {
      component.supplier.IsQcaCertified = true;
      spectator.detectComponentChanges();
      const isQcaCertified = spectator.query(
        '.cos-supplier-detail > .cos-supplier-isQca'
      );
      expect(isQcaCertified?.textContent?.trim()).toEqual(
        component.labels[component.supplier.IsQcaCertified]
      );
    });
  });

  describe('Total Employees', () => {
    it('should not be shown', () => {
      expect(spectator.query('.cos-supplier-total-employees')).toBeFalsy();
    });

    it('should show correct label', () => {
      component.supplier.TotalEmployees = '500';
      component.labels.totalEmployees = '1000';
      spectator.detectComponentChanges();
      const supplierEmployees = spectator.query(
        '.cos-supplier-detail > .cos-supplier-total-employees-label'
      );
      expect(supplierEmployees?.textContent?.trim()).toEqual(
        component.labels.totalEmployees
      );
    });

    it('should display correct data', () => {
      component.supplier.TotalEmployees = '500';
      spectator.detectComponentChanges();
      const employees = spectator.queryAll('.cos-supplier-total-employees');
      expect(employees[0].textContent?.trim()).toBe(
        component.supplier.TotalEmployees
      );
    });
  });

  describe('Years in industry', () => {
    it('should not be shown', () => {
      expect(
        spectator.query('.cos-supplier-detail > .cos-supplier-year-in-industry')
      ).toBeFalsy();
    });

    it('should show correct supplier year label details', () => {
      component.supplier.YearInIndustry = 1990;
      component.labels.yearsInIndustry = '10';
      spectator.detectComponentChanges();
      const yearsInIndustry = spectator.query(
        '.cos-supplier-detail > .cos-supplier-year-in-industry'
      );
      expect(yearsInIndustry?.textContent?.trim()).toEqual(
        component.labels.yearsInIndustry
      );
    });
  });

  describe('Year established', () => {
    it('should not be shown', () => {
      expect(spectator.query('.cos-suppler-year-established')).toBeFalsy();
    });

    it('should show correct supplier year label', () => {
      component.supplier.YearEstablished = '12';
      spectator.detectComponentChanges();
      const supplierFunctionLabel = spectator.query(
        '.cos-supplier-detail > .cos-supplier-year-label'
      );
      expect(supplierFunctionLabel?.textContent?.trim()).toEqual(
        component.labels.yearEstablished
      );
    });

    it('should display correct cos supplier year established', () => {
      component.supplier.YearEstablished = '12';
      spectator.detectComponentChanges();
      const yearEstablished = spectator.queryAll(
        '.cos-suppler-year-established'
      );
      expect(yearEstablished[0].textContent?.trim()).toContain(
        component.supplier.YearEstablished
      );
    });
  });

  it('should show correct supplier year in industry label', () => {
    component.labels.details = 'Details for Label';
    spectator.detectComponentChanges();
    const supplierLabel = spectator.query(
      '.cos-supplier-page-header-details > .cos-supplier-label-details'
    );
    expect(supplierLabel?.textContent?.trim()).toEqual(
      component.labels.details
    );
  });

  it('should display correct cos supplier preferred description', () => {
    component.supplier.Preferred.Description =
      'Preferred Description for Supplier';
    spectator.detectComponentChanges();
    const description = spectator.queryAll(
      '.cos-supplier-preferred-description'
    );
    expect(description[0].textContent?.trim()).toBe(
      component.supplier.Preferred.Description
    );
  });

  it('should display correct cos supplier preferred exceptions', () => {
    component.supplier.Preferred.Exceptions =
      'Preferred Exceptions for Supplier';
    spectator.detectComponentChanges();
    const exception = spectator.queryAll('.cos-supplier-preferred-exceptions');
    expect(exception[0].textContent?.trim()).toBe(
      `${component.labels.exceptions}: ${component.supplier.Preferred.Exceptions}`
    );
  });

  it('No image available should be displayed if no logo is present', () => {
    component.imgError = true;
    spectator.detectComponentChanges();
    const supplierImage = spectator.query('.cos-supplier-img-error');
    expect(supplierImage).toBeTruthy();
  });

  it('should display correct cos supplier preferred description when description is very long', () => {
    component.supplier.Preferred.Description =
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
    spectator.detectComponentChanges();
    const description = spectator.queryAll(
      '.cos-supplier-preferred-description'
    );
    expect(description[0].textContent?.trim()).toBe(
      component.supplier.Preferred.Description
    );
  });

  it('should not display cos supplier preferred description and label pricing', () => {
    component.supplier.Preferred.Description = null;
    spectator.detectComponentChanges();
    const preferred = spectator.query('.cos-supplier-preferred-details');
    expect(preferred).toBeFalsy();
  });

  it('should display correct cos supplier production time', () => {
    component.supplier.ProductionTime.Name = 'Production Name';
    spectator.detectComponentChanges();
    const time = spectator.queryAll('.cos-supplier-production-time');
    expect(time[0].textContent?.trim()).toBe(
      component.supplier.ProductionTime.Name
    );
  });

  it('should not display cos supplier production time details', () => {
    component.supplier.ProductionTime = null;
    spectator.detectComponentChanges();
    const production = spectator.query('.cos-supplier-production-time-details');
    expect(production).toBeFalsy();
  });

  it('should display correct cos supplier label production time name', () => {
    component.labels.standardProductionTime = '15 days';
    spectator.detectComponentChanges();
    const labelTime = spectator.query(
      '.cos-supplier-production-time-details > .cos-supplier-production-time-label'
    );
    expect(labelTime?.textContent?.trim()).toBe(
      component.labels.standardProductionTime
    );
  });

  it('should display correct cos supplier rush time name', () => {
    component.supplier.RushTime.Name = 'Rush Time Supplier Name';
    spectator.detectComponentChanges();
    const supplierRushTime = spectator.queryAll('.cos-supplier-rush-time-name');
    expect(supplierRushTime[0].textContent?.trim()).toBe(
      component.supplier.RushTime.Name
    );
  });

  it('should not display cos supplier rush time names', () => {
    component.supplier.RushTime = null;
    spectator.detectComponentChanges();

    const name = spectator.query('.cos-supplier-rush-time-details');
    expect(name).toBeFalsy();
  });

  it('should render cos-contact-info component', () => {
    const supplierContactInfo = spectator.query(
      '.cos-supplier-page-header-contact-info > cos-contact-info'
    );
    expect(supplierContactInfo).toBeTruthy();
    expect(
      supplierContactInfo?.getAttribute('ng-reflect-supplier')
    ).toBeDefined();
    expect(
      supplierContactInfo?.getAttribute('ng-reflect-labels')
    ).toBeDefined();
    expect(
      supplierContactInfo?.getAttribute('ng-reflect-social-links')
    ).toEqual('true');
  });

  it('verify button label', () => {
    const buttonElementLabel = spectator.query(
      '.cos-supplier-page-header-contact-info > .cos-card-expand > button'
    );
    expect(buttonElementLabel?.textContent?.trim()).toEqual(
      component.labels.viewMore
    );
  });

  it('verify the Arrow to be down when "View More Information" label is present', () => {
    const buttonElementLabel = spectator.query(
      '.cos-supplier-page-header-contact-info > .cos-card-expand > button > i'
    );
    expect(
      buttonElementLabel?.classList.contains('fa-angle-down')
    ).toBeTruthy();
  });

  it('should not show company contacts', () => {
    component.supplier.Contacts = [];
    spectator.detectComponentChanges();
    const supplierCompanyContacts = spectator.query('.cos-supplier-contacts');
    expect(supplierCompanyContacts).toBeFalsy();
  });

  it('should render cos-contact-info component to Company contacts', () => {
    const supplierCompanyContacts = spectator.query(
      'cos-contact-info.cos-supplier-contacts'
    );
    expect(supplierCompanyContacts).toBeTruthy();
    expect(supplierCompanyContacts?.getAttribute('ng-reflect-heading')).toEqual(
      'Company Contacts'
    );
    expect(
      supplierCompanyContacts?.getAttribute('ng-reflect-contacts')
    ).toBeDefined();
  });

  it('should not show Distributor References', () => {
    component.supplier.References = [];
    spectator.detectComponentChanges();
    const supplierReferences = spectator.query('.cos-supplier-references');
    expect(supplierReferences).toBeFalsy();
  });

  it('should render cos-contact-info component to Distributor References', () => {
    const supplierReferences = spectator.query(
      'cos-contact-info.cos-supplier-references'
    );
    expect(supplierReferences).toBeTruthy();
    expect(
      supplierReferences?.getAttribute('ng-reflect-references')
    ).toBeDefined();
  });

  it('verify Expand all button label', () => {
    const buttonElementLabel = spectator.query('.cos-card-expand-all > button');
    expect(buttonElementLabel?.textContent?.trim()).toEqual(
      component.labels.viewMore
    );
  });

  it('verify the Arrow to be down when "View More Information" label is present', () => {
    const buttonElementLabel = spectator.query(
      '.cos-card-expand-all > button > i'
    );
    expect(
      buttonElementLabel?.classList.contains('fa-angle-down')
    ).toBeTruthy();
  });
});
