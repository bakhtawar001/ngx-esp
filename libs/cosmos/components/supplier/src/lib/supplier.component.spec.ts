import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CosSupplierComponent } from './supplier.component';
import { CosSupplierModule } from './supplier.module';

describe('CosSupplierComponent', () => {
  let component: CosSupplierComponent;
  let spectator: Spectator<CosSupplierComponent>;

  const createComponent = createComponentFactory({
    component: CosSupplierComponent,
    imports: [CosSupplierModule],
    declareComponent: false,
  });

  beforeEach(() => {
    const supplier = {
      AsiNumber: '84592',
      Addresses: {
        Primary: null,
      },
      Contacts: [],
      Artwork: null,
      Name: 'St Regis Group',
      Preferred: {
        Name: 'Gold',
      },
      Phone: null,
      Fax: null,
      Email: null,
      Websites: null,
      Address: null,
      OfficeHours: null,
      Orders: null,
      Type: null,
      ProductionTime: null,
      ImprintingMethods: null,
      MarketingPolicy: null,
      YearEstablished: null,
      YearInIndustry: null,
      TotalEmployees: null,
      IsMinorityOwned: null,
      IsUnionAvailable: null,
      IsCanadian: null,
      IsCanadianFriendly: null,
      HasDistributorAffiliation: null,
      Functions: null,
      IsQcaCertified: true,
      DistributionPolicy: 'Territorial (within geographic area only)',
      Id: 7730,
      Rating: {
        Rating: 9,
        Companies: 41,
        Transactions: 247,
      },
      Links: null,
      Phones: null,
      Ratings: {
        OverAll: { Rating: 9, Companies: 41, Transactions: 247 },
        Quality: { Rating: 9, Companies: 36, Transactions: 206 },
        Communication: { Rating: 9, Companies: 35, Transactions: 202 },
        Delivery: { Rating: 9, Companies: 34, Transactions: 201 },
        ConflictResolution: {
          Rating: 8,
          Companies: 13,
          Transactions: 133,
        },
        Decoration: { Rating: 9, Companies: 34, Transactions: 201 },
      },
      References: null,
      ShippingPoints: null,
    };
    spectator = createComponent({
      props: {
        supplier,
        showImage: false,
        showPreferredGroup: false,
      },
    });

    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Supplier card to be clickable', () => {
    const supplierCard = spectator.query('.cos-supplier-wrapper > div');
    expect(supplierCard).toHaveClass('cursor-pointer');
  });

  it('should add text to various nodes', () => {
    const supplierName = spectator.queryAll('.cos-supplier-name');
    const asiNumber = spectator.queryAll('.cos-supplier-number');

    expect(supplierName[0].textContent!.trim()).toBe('St Regis Group');
    expect(asiNumber[0].textContent!.trim()).toBe('asi/84592');
  });

  it('should hide or show image based on boolean value and set URL of image based on ID', () => {
    let supplierImgContainer = spectator.queryAll(
      '.cos-supplier-img-container'
    );

    expect(supplierImgContainer.length).toBeFalsy();

    component.showImage = true;

    spectator.detectComponentChanges();

    supplierImgContainer = spectator.queryAll('.cos-supplier-img-container');
    const supplierImg = spectator.queryAll('.cos-supplier-img');
    expect(supplierImgContainer.length).toBeTruthy();
    expect((<HTMLImageElement>supplierImg[0]).src).toBe(
      'https://commonmedia.asicentral.com/supplierlogos/7730/logo.png'
    );
  });

  it('should hide or show preferred groups and set text when true', () => {
    let preferredGroupsContainer = spectator.queryAll('.cos-attribute-tag');

    expect(preferredGroupsContainer).not.toContain('Gold');

    component.showPreferredGroup = true;
    spectator.detectComponentChanges();

    preferredGroupsContainer = spectator.queryAll('.cos-attribute-tag');

    expect(preferredGroupsContainer.length).toBeTruthy();
    expect(preferredGroupsContainer[0].textContent!.trim()).toBe('Gold');
  });

  it('should show supplier ratings', () => {
    const ratingsContainer = spectator.query('.cos-supplier-rating');
    expect(ratingsContainer).toBeTruthy();
  });

  it('should show supplier name', () => {
    const ratingsContainer = spectator.query('.cos-supplier-name');
    expect(ratingsContainer!.innerHTML).toContain('St Regis Group');
  });

  it('should show supplier asi number', () => {
    const ratingsContainer = spectator.query('.cos-supplier-number');
    expect(ratingsContainer!.innerHTML).toContain('asi/84592');
  });

  it('should open the SDP in a new tab when you click any section of the Supplier Card', () => {
    const supplierCard = spectator.query('.cos-supplier-body');
    const emitSpy = jest.spyOn(component.detailClick, 'emit');

    spectator.click(supplierCard);

    expect(emitSpy).toHaveBeenLastCalledWith(component.supplier);
  });
});
