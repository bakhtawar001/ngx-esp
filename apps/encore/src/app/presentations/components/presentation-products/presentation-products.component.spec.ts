import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { dataCySelector } from '@cosmos/testing';
import { PresentationProduct } from '@esp/models';
import {
  EspPresentationsModule,
  PresentationProductsApiService,
  PresentationsActions,
} from '@esp/presentations';
import {
  mockPresentationProduct,
  PresentationMockDb,
} from '@esp/__mocks__/presentations';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import {
  ProductGalleryComponent,
  ProductGalleryComponentModule,
} from '../../../products/components/product-gallery';
import {
  PresNoProductsMessageComponent,
  PresNoProductsMessageModule,
} from '../../pages/presentation-settings/components/empty_state/NoProductsMessage/NoProductsMessage.component';
import {
  PresentationProductsComponent,
  PresentationProductsComponentModule,
} from './presentation-products.component';

const domQueries = {
  productCard: 'cos-product-card',
  actionsMenuButton: 'button.actions-menu-btn',
  visibleProducts: dataCySelector('visible-products'),
  hiddenProducts: dataCySelector('hidden-products'),
  showInPresentation: dataCySelector('show-in-presentation'),
  matTabLabels: '.mat-tab-labels',
};

const presentation = PresentationMockDb.presentation;

describe('PresentationProductsComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationProductsComponent,
    imports: [
      RouterTestingModule,
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      PresentationProductsComponentModule,
      EspPresentationsModule,
    ],
    providers: [
      mockProvider(PresentationProductsApiService, {
        saveVisibility() {
          return of('Observable that emits nothing.');
        },
      }),
    ],
    overrideModules: [
      [
        PresNoProductsMessageModule,
        {
          set: {
            declarations: MockComponents(PresNoProductsMessageComponent),
            exports: MockComponents(PresNoProductsMessageComponent),
          },
        },
      ],
      [
        ProductGalleryComponentModule,
        {
          set: {
            declarations: MockComponents(ProductGalleryComponent),
            exports: MockComponents(ProductGalleryComponent),
          },
        },
      ],
    ],
  });

  const testSetup = () => {
    const visibleProducts: PresentationProduct[] = [];
    const hiddenProducts: PresentationProduct[] = [];

    for (let index = 1; index <= 3; index++) {
      // We'll have 3 visible products with IDs `[1, 2, 3]`.
      visibleProducts.push(
        mockPresentationProduct((product) => {
          product.Id = index;
          product.IsVisible = true;
          return product;
        })
      );
    }

    for (let index = 4; index <= 7; index++) {
      // We'll have 4 hidden products with IDs `[4, 5, 6, 7]`.
      hiddenProducts.push(
        mockPresentationProduct((product) => {
          product.Id = index;
          product.IsVisible = false;
          return product;
        })
      );
    }

    const products = visibleProducts.concat(hiddenProducts);
    // Do not run the change detection before we call `store.reset` since local state properties
    // will equal `undefined`.
    const spectator = createComponent({
      detectChanges: false,
    });
    const store = spectator.inject(Store);
    const actions$ = spectator.inject(Actions);
    store.reset({
      presentations: {
        presentation: {
          ...presentation,
          Products: products,
        },
      },
    });

    spectator.detectComponentChanges();

    return {
      spectator,
      store,
      actions$,
      component: spectator.component,
      state: spectator.component.state,
    };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();
    // Assert
    expect(component).toBeTruthy();
  });

  it("should display the header 'Edit Products' correctly", () => {
    // Arrange
    const { spectator } = testSetup();
    const header = spectator.query('.header-style-22');

    // Assert
    expect(header).toBeVisible();
    expect(header).toHaveText('Edit Products');
  });

  it("should display the Tabs correctly as 'All Products' and 'Hidden' respectively", () => {
    // Arrange
    const { spectator } = testSetup();
    const tabHeaders = spectator.queryAll('.mat-tab-label-content');

    // Assert
    expect(tabHeaders).toBeVisible();
    expect(tabHeaders).toHaveLength(2);
    expect(tabHeaders[0]).toHaveText('All Products');
    expect(tabHeaders[1]).toHaveText('Hidden');
  });

  describe('Sort by menu', () => {
    it("should display 'Sort By' menu label", () => {
      // Arrange
      const { spectator } = testSetup();
      const sortByMenuLabel = spectator.query(
        'cos-form-field.search-sort > label'
      );

      // Assert
      expect(sortByMenuLabel).toBeVisible();
    });

    it('should display the Sort by select control', () => {
      // Arrange
      const { spectator } = testSetup();
      const sortByControl = spectator.query(
        'cos-form-field.search-sort > .cos-form-field-input-wrapper > select'
      );

      expect(sortByControl).toBeVisible();
    });

    it('should display correct menu options', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const sortByOptions = spectator
        .query(
          'cos-form-field.search-sort > .cos-form-field-input-wrapper > select'
        )
        .querySelectorAll('option');

      // Assert
      expect(sortByOptions).toHaveLength(component.sortMenuOptions.length);
      sortByOptions.forEach((sortByOption, index) => {
        expect(sortByOption).toHaveText(component.sortMenuOptions[index].name);
      });
    });
    it("should call the store's dispatch when the sort value is changed", () => {
      // Arrange
      const { spectator, store, component, state } = testSetup();

      const sortByControl = spectator.query(
        'cos-form-field.search-sort > .cos-form-field-input-wrapper > select'
      ) as HTMLSelectElement;

      expect(sortByControl).toBeVisible();

      expect(sortByControl).toHaveSelectedOptions('None');
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      //Act
      spectator.selectOption(sortByControl, component.sortMenuOptions[1].value);
      component.sortProducts(component.sortMenuOptions[1].value);
      spectator.detectComponentChanges();
      //Assert
      expect(dispatchSpy).toHaveBeenCalledWith(
        new PresentationsActions.SortProducts(
          state.presentation.Id,
          component.sortMenuOptions[1].value
        )
      );
      expect(sortByControl).toHaveSelectedOptions(
        component.sortMenuOptions[1].value
      );
    });
  });

  it('should display the product cards when products are available', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const productCards = spectator.queryAll('cos-product-card');

    // Assert
    expect(productCards).toBeVisible();
    expect(productCards).toHaveLength(component.state.visibleProducts.length);
  });

  it("should display the following options against each product card: 'Add to Order', 'Hide from Presentation' and 'Remove from Presentation' along with their respective icons", () => {
    // Arrange
    const { spectator } = testSetup();
    const menuTriggerBtn = spectator
      .queryAll('.cos-product-card-actions')[0]
      .querySelector('.mat-menu-trigger.actions-menu-btn');

    // Assert
    expect(menuTriggerBtn).toBeVisible();

    // Act now
    spectator.click(menuTriggerBtn);
    spectator.detectComponentChanges();
    const menuOptions = spectator.queryAll('.cos-menu-item');
    const menuOptionsIcons = spectator.queryAll('.cos-menu-item > i');

    // Re-Assert
    expect(menuOptionsIcons[0]).toHaveClass('fa fa-file-invoice');
    expect(menuOptionsIcons[1]).toHaveClass('fa fa-eye-slash');
    expect(menuOptionsIcons[2]).toHaveClass('fa fa-trash-alt');
    expect(menuOptions[0]).toHaveDescendant(menuOptionsIcons[0]);
    expect(menuOptions[1]).toHaveDescendant(menuOptionsIcons[1]);
    expect(menuOptions[2]).toHaveDescendant(menuOptionsIcons[2]);
    expect(menuOptions[0]).toHaveText('Add to Order');
    expect(menuOptions[1]).toHaveText('Hide from Presentation');
    expect(menuOptions[2]).toHaveText('Remove from Presentation');
  });

  it('should allow a user to hide a product from the presentation if they have edit rights to the project', () => {
    // Arrange
    const { component, spectator, store } = testSetup();
    const menuTriggerBtn = spectator
      .queryAll('.cos-product-card-actions')[0]
      .querySelector('.mat-menu-trigger.actions-menu-btn');
    jest.spyOn(component, 'saveVisibility');
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    // Act
    spectator.click(menuTriggerBtn);
    spectator.detectComponentChanges();
    const menuOptions = spectator.queryAll('.cos-menu-item');
    spectator.click(menuOptions[1]);
    spectator.detectComponentChanges();

    // Re-Assert
    expect(component.saveVisibility).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it("should delete the product when 'Remove from presentation' button is clicked", () => {
    // Arrange
    const { component, spectator, state, store } = testSetup();
    const menuTriggerBtn = spectator
      .queryAll('.cos-product-card-actions')[0]
      .querySelector('.mat-menu-trigger.actions-menu-btn');
    jest.spyOn(component, 'removeProduct');
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    // Act
    spectator.click(menuTriggerBtn);
    spectator.detectComponentChanges();
    const menuOptions = spectator.queryAll('.cos-menu-item');
    spectator.click(menuOptions[2]);
    spectator.detectComponentChanges();

    // Re-Assert
    expect(component.removeProduct).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      new PresentationsActions.RemoveProduct(
        state.presentation.Id,
        state.visibleProducts[0].Id
      )
    );
  });

  it("should redirect the user to appropriate product's page for a specific product", () => {
    // Arrange
    const { component, spectator } = testSetup();
    const productCardsLinks = spectator.queryAll(
      '.proj-pres__products-grid > .cursor-pointer'
    );

    // Assert
    expect(productCardsLinks).toHaveLength(
      component.state.visibleProducts.length
    );
    productCardsLinks.forEach((link, index) => {
      expect(link.getAttribute('ng-reflect-router-link')).toEqual(
        `/presentations,${presentation.Id},product,${component.state.visibleProducts[index].Id}`
      );
    });
  });

  describe('3 dot menu and its actions', () => {
    it('should display a 3 dot menu on each product', () => {
      // Arrange
      const { spectator, state } = testSetup();
      const productCards = spectator.queryAll(domQueries.productCard);
      // Assert
      expect(productCards.length).toEqual(state.visibleProducts.length);

      const actionMenus = productCards.map((productCard) =>
        productCard.querySelector(domQueries.actionsMenuButton)
      );

      // Assert
      expect(actionMenus.length).toEqual(productCards.length);

      // Act
      spectator.click(actionMenus[0]);

      const productCardActions = spectator.queryAll('.cos-menu-item');
      // Assert
      expect(productCardActions[0]).toContainText('Add to Order');
      expect(productCardActions[1]).toContainText('Hide from Presentation');
      expect(productCardActions[2]).toContainText('Remove from Presentation');
    });

    it('should switch to `Hidden` tab and display 3 dots menu on each product', fakeAsync(() => {
      // Arrange
      const { spectator, state } = testSetup();
      const matTabLabelsContainer = spectator.query(domQueries.matTabLabels);
      // Assert
      expect(matTabLabelsContainer.children.length).toEqual(2);
      const [allProductsMatTabLabel, hiddenProductsMatTabLabel] =
        matTabLabelsContainer.children;
      expect(allProductsMatTabLabel).toContainText('All Products');
      expect(hiddenProductsMatTabLabel).toContainText('Hidden');
      // Act
      spectator.click(hiddenProductsMatTabLabel);
      // Wait for animations to flush.
      spectator.tick();
      spectator.detectComponentChanges();
      // Assert
      expect(spectator.query(dataCySelector('hidden-products'))).toExist();
      const actionMenus = spectator
        .queryAll(domQueries.productCard)
        .map((productCard) =>
          productCard.querySelector(domQueries.actionsMenuButton)
        );
      expect(actionMenus.length).toEqual(state.hiddenProducts.length);
      flush();
    }));
  });

  describe('visible products', () => {
    it('should allow a user to hide a product from the presentation', () => {
      // Arrange
      const { spectator, component, state, actions$ } = testSetup();
      const saveVisibilitySpy = jest.spyOn(component, 'saveVisibility');
      const subscribeSpy = jest.fn();
      const subscription = actions$
        .pipe(
          ofActionDispatched(
            PresentationsActions.UpdatePresentationProductVisibility
          )
        )
        .subscribe(subscribeSpy);

      // Act
      spectator.click(spectator.query(domQueries.actionsMenuButton));
      spectator.click(
        spectator.query(dataCySelector('hide-from-presentation'))
      );

      const productCards = spectator.queryAll(domQueries.productCard);

      try {
        // Assert
        expect(saveVisibilitySpy).toHaveBeenCalled();
        // Ensure that the `UpdatePresentationProductVisibility` has been dispatched.
        expect(subscribeSpy).toHaveBeenCalledWith({
          productId: 1,
          isVisible: false,
        });
        // We had 3 visible products initially.
        expect(state.visibleProducts.length).toEqual(2);
        expect(productCards.length).toEqual(state.visibleProducts.length);
        // We had 4 hidden products initially.
        expect(state.hiddenProducts.length).toEqual(5);
      } finally {
        saveVisibilitySpy.mockRestore();
        subscription.unsubscribe();
      }
    });
  });

  describe('hidden products', () => {
    it('should display all of the hidden products added to the presentation', fakeAsync(() => {
      // Arrange
      const { spectator, state } = testSetup();
      const matTabLabelsContainer = spectator.query(domQueries.matTabLabels);
      // Assert
      expect(matTabLabelsContainer.children.length).toEqual(2);
      const [allProductsMatTabLabel, hiddenProductsMatTabLabel] =
        matTabLabelsContainer.children;
      expect(allProductsMatTabLabel).toContainText('All Products');
      expect(hiddenProductsMatTabLabel).toContainText('Hidden');
      // Act
      spectator.click(hiddenProductsMatTabLabel);
      // Wait for animations to flush.
      spectator.tick();
      spectator.detectComponentChanges();
      // Assert
      expect(spectator.query(dataCySelector('hidden-products'))).toExist();
      const hiddenProductCards = spectator.queryAll(domQueries.productCard);
      expect(hiddenProductCards.length).toEqual(state.hiddenProducts.length);
      flush();
    }));

    it('should allow a user to make a product visible', fakeAsync(() => {
      // Arrange
      const { spectator, state } = testSetup();
      const matTabLabelsContainer = spectator.query(domQueries.matTabLabels);
      const [allProductsMatTabLabel, hiddenProductsMatTabLabel] =
        matTabLabelsContainer.children;
      // Act
      spectator.click(hiddenProductsMatTabLabel);
      // Wait for animations to flush.
      spectator.tick();
      spectator.detectComponentChanges();

      // Assert
      expect(state.visibleProducts.length).toEqual(3);
      expect(state.hiddenProducts.length).toEqual(4);

      spectator.click(spectator.query(domQueries.actionsMenuButton));
      spectator.click(spectator.query(domQueries.showInPresentation));

      // Assert
      expect(state.visibleProducts.length).toEqual(4);
      expect(state.hiddenProducts.length).toEqual(3);

      // Act
      spectator.click(allProductsMatTabLabel);
      // Wait for animations to flush.
      spectator.tick();
      spectator.detectComponentChanges();

      // Assert
      expect(
        spectator.query(domQueries.visibleProducts).children.length
      ).toEqual(state.visibleProducts.length);
      flush();
    }));
    it("should delete the product when 'Remove from presentation' button is clicked", fakeAsync(() => {
      // Arrange
      const { spectator, state, component, store } = testSetup();
      const matTabLabelsContainer = spectator.query(domQueries.matTabLabels);
      const [allProductsMatTabLabel, hiddenProductsMatTabLabel] =
        matTabLabelsContainer.children;
      // Act
      spectator.click(hiddenProductsMatTabLabel);
      spectator.tick();
      spectator.detectComponentChanges();

      // Arrange
      const menuTriggerBtn = spectator
        .queryAll('.cos-product-card-actions')[0]
        .querySelector('.mat-menu-trigger.actions-menu-btn');
      jest.spyOn(component, 'removeProduct');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      // Act
      spectator.click(menuTriggerBtn);
      spectator.detectComponentChanges();
      const menuOptions = spectator.queryAll('.cos-menu-item');
      spectator.click(menuOptions[2]);
      spectator.detectComponentChanges();

      // Re-Assert
      expect(component.removeProduct).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        new PresentationsActions.RemoveProduct(
          state.presentation.Id,
          state.hiddenProducts[0].Id
        )
      );
      flush();
    }));
  });
});
