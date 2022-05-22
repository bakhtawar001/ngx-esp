import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastActions } from '@cosmos/components/notification';
import { NgxsActionCollector } from '@cosmos/testing';
import { Presentation, PresentationSettings } from '@esp/models';
import { mockPresentationProduct } from '@esp/__mocks__/presentations';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { ConfigureProductsButtonComponent } from '.';
import { PresentationsActions } from '../../actions';
import { PresentationsApiService } from '../../api/presentations-api.service';
import { PresentationsQueries } from '../../queries';
import { PresentationsState } from './presentations.state';

describe('PresentationsState', () => {
  const createService = createServiceFactory({
    imports: [
      NgxsModule.forRoot([PresentationsState]),
      NgxsActionCollector.collectActions(),
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        { path: 'projects/:id/presentations/', component: {} as any },
      ]),
    ],
    service: PresentationsState,
    providers: [PresentationsApiService],
  });

  const testSetup = () => {
    const spectator = createService();

    const actions$ = spectator.inject(Actions);
    const http = spectator.inject(HttpTestingController);
    const router = spectator.inject(Router);
    const state = spectator.inject(PresentationsState);
    const presentationsService = spectator.inject(PresentationsApiService);
    const actionCollector = spectator.inject(NgxsActionCollector);
    const actionsDispatched = actionCollector.dispatched;
    const store = spectator.inject(Store);

    function getDispatchedActionsOfType<T>(actionType: Type<T>): T[] {
      return actionsDispatched.filter((item) => item instanceof actionType);
    }

    const getHiddenProducts = () =>
      store.selectSnapshot(PresentationsQueries.getHiddenProducts);
    const getVisibleProducts = () =>
      store.selectSnapshot(PresentationsQueries.getVisibleProducts);
    const getPresentation = () =>
      store.selectSnapshot(PresentationsQueries.getPresentation);

    const hiddenPresentationProduct = mockPresentationProduct((product) => {
      product.Id = 2;
      product.IsVisible = false;
      return product;
    });
    const visiblePresentationProduct = mockPresentationProduct((product) => {
      product.Id = 1;
      product.IsVisible = true;
      return product;
    });
    return {
      spectator,
      store,
      getHiddenProducts,
      getVisibleProducts,
      getPresentation,
      hiddenPresentationProduct,
      visiblePresentationProduct,
      http,
      presentationsService,
      router,
      state,
      actions$,
      actionsDispatched,
      getShowToastActionsDispatched: () =>
        getDispatchedActionsOfType<ToastActions.Show>(ToastActions.Show),
      getNavigateActionsDispatched: () =>
        getDispatchedActionsOfType<Navigate>(Navigate),
    };
  };

  it('should update product visibility', () => {
    // Arrange
    const {
      store,
      hiddenPresentationProduct,
      visiblePresentationProduct,
      getHiddenProducts,
      getVisibleProducts,
    } = testSetup();

    // Act
    store.reset({
      presentations: {
        presentation: {
          Products: [hiddenPresentationProduct, visiblePresentationProduct],
        },
      },
    });

    // Assert
    expect(getVisibleProducts()).toEqual([visiblePresentationProduct]);

    // Act
    store.dispatch(
      new PresentationsActions.UpdatePresentationProductVisibility(
        visiblePresentationProduct.Id,
        !visiblePresentationProduct.IsVisible
      )
    );

    // Assert
    expect(getVisibleProducts()).toEqual([]);

    const hiddenProducts = getHiddenProducts();
    const productThatWasVisibleBefore = hiddenProducts.find(
      (product) => product.Id === visiblePresentationProduct.Id
    );

    // Assert
    expect(hiddenProducts.length).toEqual(2);
    expect(productThatWasVisibleBefore).not.toBeUndefined();
    expect(productThatWasVisibleBefore.IsVisible).toEqual(false);
  });

  describe('Add Products to Presentation', () => {
    it('should display success message toast when products are added succesfully', async () => {
      //Arrange
      const { getShowToastActionsDispatched, store, presentationsService } =
        testSetup();
      const projectName = 'Test';
      const productIds = [1, 2, 3];
      const duration = 8e3;

      jest.spyOn(presentationsService, 'addProducts').mockReturnValue(
        of({
          Presentation: {
            Id: 1,
            ProjectId: 11,
          } as Presentation,
          ProductsAdded: productIds,
          ProductsDuplicated: [],
          ProductsTruncated: [],
        })
      );
      //Act
      await store.dispatch(
        new PresentationsActions.AddProducts(1, projectName, productIds)
      );

      //Assert
      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: {
            title: 'Success!',
            body: `${productIds.length} products added to ${projectName}`,
            type: 'confirm',
            component: ConfigureProductsButtonComponent,
            componentData: {
              presentationId: 1,
              projectId: 11,
            },
          },
          config: {
            duration,
          },
        },
      ]);
    });
    it('should display error message toast when some products are duplicated', async () => {
      //Arrange
      const { getShowToastActionsDispatched, store, presentationsService } =
        testSetup();
      const projectName = 'Test';
      const productIds = [1, 2, 3];
      const duplicatedProductIds = [2, 3];

      jest.spyOn(presentationsService, 'addProducts').mockReturnValue(
        of({
          Presentation: {
            Id: 1,
            ProjectId: 11,
          } as Presentation,
          ProductsAdded: [],
          ProductsDuplicated: duplicatedProductIds,
          ProductsTruncated: [],
        })
      );

      //Act
      await store.dispatch(
        new PresentationsActions.AddProducts(1, projectName, productIds)
      );

      //Assert
      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: {
            title: 'Error: Products not added!',
            body: `${duplicatedProductIds.length} product(s) already exist in ${projectName}!`,
            type: 'error',
          },
          config: { duration: 8e3 },
        },
      ]);
    });
    it('should display error message toast when some products are truncated', async () => {
      //Arrange
      const { getShowToastActionsDispatched, store, presentationsService } =
        testSetup();
      const projectName = 'Test';
      const productIds = [1, 2, 3];
      const ProductsTruncated = [2, 3];

      jest.spyOn(presentationsService, 'addProducts').mockReturnValue(
        of({
          Presentation: {
            Id: 1,
            ProjectId: 11,
          } as Presentation,
          ProductsAdded: [],
          ProductsDuplicated: [],
          ProductsTruncated: ProductsTruncated,
        })
      );

      //Act
      await store.dispatch(
        new PresentationsActions.AddProducts(1, projectName, productIds)
      );

      //Assert
      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: {
            title: 'Error: Too many products',
            body: `${
              ProductsTruncated.length
            } product(s) were unable to be added. ${250} product per presentation limit reached.`,
            type: 'error',
          },
          config: { duration: 8e3 },
        },
      ]);
    });

    it('should display error message toast, when some products are failed to be added', async () => {
      //Arrange
      const { getShowToastActionsDispatched, store, presentationsService } =
        testSetup();
      const projectName = 'Test';
      const productIds = [1, 2, 3];
      jest
        .spyOn(presentationsService, 'addProducts')
        .mockReturnValue(throwError(() => new Error('test')));
      //Act
      await store.dispatch(
        new PresentationsActions.AddProducts(1, projectName, productIds)
      );

      //Assert
      const toastActions = getShowToastActionsDispatched();
      expect(toastActions).toEqual([
        {
          payload: {
            title: 'Error!',
            body: `${productIds.length} product(s) failed to add, please try again.`,
            type: 'error',
          },
        },
      ]);
    });
  });
  it('should update presentation settings', () => {
    // Arrange
    const { store, presentationsService, getPresentation } = testSetup();
    const settings: PresentationSettings = {
      ShowProductColors: true,
      ShowProductSizes: true,
      ShowProductShape: true,
      ShowProductMaterial: true,
      ShowProductCPN: true,
      ShowProductImprintMethods: true,
      ShowProductPricing: true,
      ShowProductPriceGrids: true,
      ShowProductPriceRanges: true,
      ShowProductAdditionalCharges: true,
    };

    store.reset({
      presentations: {
        presentation: {
          Settings: settings,
        },
      },
    });
    const presentation = {
      Settings: {
        ...settings,
        ShowProductColors: false,
        ShowProductSizes: false,
        ShowProductShape: false,
        ShowProductMaterial: false,
        ShowProductCPN: false,
        ShowProductImprintMethods: false,
        ShowProductPricing: false,
        ShowProductPriceGrids: false,
        ShowProductPriceRanges: false,
        ShowProductAdditionalCharges: false,
      },
    } as Presentation;

    jest
      .spyOn(presentationsService, 'update')
      .mockReturnValue(of(presentation));

    // Act
    store.dispatch(new PresentationsActions.Update(presentation));

    // Assert
    expect(getPresentation()).toEqual(presentation);
  });
});
