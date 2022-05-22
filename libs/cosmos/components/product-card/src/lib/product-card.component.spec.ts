import { CosSupplierModule } from '@cosmos/components/supplier';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ProductsMockDb } from '@smartlink/products/mocks';
import { CosProductCardComponent } from './product-card.component';
import { CosProductCardModule } from './product-card.module';

const mockProduct = ProductsMockDb.products[0];

const template = `
    <cos-product-card
      [status]="status"
      [product]="product"
      [isDraggable]="false"
      [selected]="product"
      [productActionsTemplate]="productCardActions"
    >
      <cos-supplier
        *ngIf="showSupplier"
        [supplier]="product.Supplier"
        [showImage]="false"
        [showPreferredGroup]="true"
      ></cos-supplier>


    </cos-product-card>

    <ng-template #productCardActions let-product="product">
      <button *ngIf="collection.IsEditable"
              type="button" mat-menu-item  class="cos-menu-item text-warning remove-from-collection">
              <i class="fa fa-trash-alt"></i>
              <span>Remove from Collection</span>
      </button>
    </ng-template>
`;
const prop = {
  status: { Icon: 'shopping-cart', Label: 'In Cart', Color: 'blue' },
  showSupplier: true,
  selectLabel: '',
  product: { ...mockProduct, IsDeleted: true },
  collection: {
    IsEditable: true,
  },
};
describe('CosProductCardComponent', () => {
  let component: CosProductCardComponent;
  let spectator: Spectator<CosProductCardComponent>;
  const createComponent = createComponentFactory({
    component: CosProductCardComponent,
    imports: [CosProductCardModule, CosSupplierModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { ...prop },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.component).toExist();
  });

  describe('When product is not available', () => {
    beforeEach(() => {
      spectator = createComponent({
        props: { ...prop },
      });
      component = spectator.component;
    });
    it('should show disabled product, when a product is no longer available', () => {
      spectator.detectComponentChanges();
      const product = spectator.query('.cos-card.cos-product-card');
      expect(product).toExist();
      expect(product).toHaveClass('cos-product-card--disabled');
    });

    it('Product should be disabled when a product that exists in the collection is no longer available(deleted or made inactive)', () => {
      const product = spectator.query('.cos-card.cos-product-card');
      expect(product).toExist();
      expect(product).toHaveClass('cos-product-card--disabled');
    });

    it('Product name, product id, supplier name, price information should continue to display when the product is no longer available', () => {
      const product = spectator.query('.cos-card.cos-product-card');
      expect(product).toExist();
      expect(product).toHaveClass('cos-product-card--disabled');
      const productName = spectator.query('.cos-product-card-title-link');
      expect(productName).toExist();
      expect(productName).toContainText(component.product?.Name.toString());
    });

    it('should show product name when product is not available', () => {
      const productTitle = spectator.query('.cos-product-card-title-link');
      expect(productTitle).toExist();
      expect(productTitle).toHaveText(component.product.Name.toString());
    });

    it('should display no longer available text when product is not available', () => {
      component.status = component.product.IsDeleted
        ? { Label: 'No longer available', Icon: null, Color: null }
        : null;
      spectator.detectComponentChanges();
      const indicator = spectator.query('.cos-product-card-indicator');
      expect(indicator).toExist();
      expect(indicator).toHaveText('No longer available');
    });

    it('should display Label with color text with background when color defined', () => {
      component.status = component.product.IsDeleted
        ? { Label: 'Label with color', Icon: null, Color: 'blue' }
        : null;
      spectator.detectComponentChanges();
      const indicator = spectator.query(`.cos-product-card-indicator-label`);
      expect(indicator).toExist();
      expect(indicator).toHaveText('Label with color');
      expect(indicator).toHaveClass(
        `cos-product-card-indicator-label--${component.status.Color}`
      );
    });

    it('should not allow user to add disabled product to another collection', () => {
      const addToCollectionMenuItem = spectator.query(
        '.cos-menu-item.add-to-collection'
      );
      expect(addToCollectionMenuItem).not.toExist();
    });

    it('User should not be able to add the product that is no longer available to a presentation', () => {
      const addToPresentationMenuItem = spectator.query(
        '.cos-menu-item.add-to-presentation'
      );
      expect(addToPresentationMenuItem).not.toExist();
    });

    it("should not allow user to individually select the not available product's checkbox", () => {
      const checkbox = spectator.query('.cos-checkbox');
      expect(checkbox).toHaveClass('cos-checkbox-disabled');
    });
  });

  it('should display the product name correctly', () => {
    const productName = spectator.query('.cos-product-card-title');

    expect(productName).toBeVisible();
    expect(productName).toHaveText(component.product.Name);
  });

  it("should show the 'Most Popular' label against a product", () => {
    component.status = { Label: 'Most Popular', Color: 'blue', Type: 'MTP' };
    spectator.detectComponentChanges();
    const label = spectator.query('.cos-product-card-indicator-label');

    expect(label).toBeVisible();
    expect(label).toHaveText(component.status.Label);
  });

  it('should hide or show ad badge', () => {
    let cosBadge = spectator.queryAll('.cos-badge');

    expect(cosBadge.length).toBeFalsy();

    component.product = { ...component.product, ShowAdLabel: true };
    spectator.detectComponentChanges();
    cosBadge = spectator.queryAll('.cos-badge');

    expect(cosBadge.length).toBeTruthy();
  });

  it('should hide or show details', () => {
    component.product.IsDeleted = false;
    spectator.detectComponentChanges();
    let cosDetails = spectator.queryAll('.cos-product-card-details');
    expect(cosDetails.length).toBeTruthy();
    component.product.IsDeleted = true;
    spectator.detectComponentChanges();
    cosDetails = spectator.queryAll('.cos-product-card-details');
    expect(cosDetails.length).toBeFalsy();
  });

  it('should have a checkbox that includes the name of the product', () => {
    const checkboxLabel = spectator.query('.cos-checkbox-label');
    expect(checkboxLabel.textContent.trim()).toBe(
      `${component.selectLabel || ''} ${component.product.Name}`.trim()
    );
  });

  it('could have an icon with accessibly hidden text that includes the name of the product', () => {
    const indicator = spectator.query('.cos-product-card-indicator');
    expect(indicator.textContent.trim()).toBe(
      `${component.status.Label}: ${component.product.Name}`.trim()
    );
  });

  it('uses cdkDrag directive', () => {
    const productCard = spectator.query('.cos-product-card');
    const dragClass = 'cdk-drag';
    expect(productCard.classList[1]).toBe(dragClass);
  });

  it('Product should be made enabled once its available(made active again)', () => {
    component.product.IsDeleted = false;
    spectator.detectComponentChanges();
    const product = spectator.query('.cos-card.cos-product-card');
    expect(product).not.toHaveClass('cos-product-card--unavailable');
  });
});

describe('CosProductCardComponentWithTemplate', () => {
  let spectator: SpectatorHost<CosProductCardComponent>;
  let component: CosProductCardComponent;
  const createHost = createHostFactory({
    component: CosProductCardComponent,
    imports: [CosProductCardModule, CosSupplierModule],
  });
  const setup = (params = { ...prop }) => {
    spectator = createHost(template, {
      hostProps: { ...params },
    });
    component = spectator.component;
  };
  it("The 'Remove from Collection' option should be available on the three dot menu of a product card displayed in the collection detail page", () => {
    setup();
    component.product.IsDeleted = false;
    spectator.detectComponentChanges();
    const matMenuTrigger = spectator.query(
      '.mat-menu-trigger.actions-menu-btn'
    );
    expect(matMenuTrigger).toExist();
    spectator.click(matMenuTrigger);
    spectator.detectChanges();
    const removeBtn = spectator.query('.cos-menu-item.remove-from-collection');
    expect(removeBtn.tagName).toBe('BUTTON');
    expect(removeBtn).toHaveText('Remove from Collection');
  });

  it('Should not have the three dot actions menu on a deleted product', () => {
    setup();
    component.product.IsDeleted = true;
    spectator.detectComponentChanges();
    const matMenuTrigger = spectator.query(
      '.mat-menu-trigger.actions-menu-btn'
    );
    expect(matMenuTrigger).not.toExist();
  });
});
