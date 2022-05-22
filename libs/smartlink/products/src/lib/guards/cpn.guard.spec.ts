import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthFacade } from '@esp/auth';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { CPNGuard } from './cpn.guard';

describe('CPNGuard', () => {
  // Defining the service Factory
  const createService = createServiceFactory({
    service: CPNGuard,
    imports: [
      RouterTestingModule,
      NgxsModule.forRoot(),
      HttpClientTestingModule,
    ],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          CompanyId: 601497,
        },
      }),
    ],
  });

  // Defining the test setup
  const testSetup = () => {
    const spectator = createService();
    const cpnGuard = spectator.service;
    const router = spectator.inject(Router);

    return { spectator, cpnGuard, router };
  };

  it('should be created', inject([CPNGuard], (guard: CPNGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('CanActivate', () => {
    it('Should provide a valid CPN', inject(
      [AuthFacade],
      (authFacade: AuthFacade) => {
        //Arrange
        const { cpnGuard, router } = testSetup();
        const createUrlTree = jest.spyOn(router, 'createUrlTree');
        const productId = 540156111;

        const mockData = {
          queryParamMap: convertToParamMap({
            q: `CPN-${productId + authFacade.user.CompanyId}`,
          }),
        } as ActivatedRouteSnapshot;

        // Act
        cpnGuard.canActivate(mockData);

        // Assert
        expect(createUrlTree).toHaveBeenCalledWith(['/products', productId], {
          queryParams: {
            keywords: mockData.queryParamMap.get('q'),
          },
        });
      }
    ));

    it('CPN can contain empty white space', inject(
      [AuthFacade],
      (authFacade: AuthFacade) => {
        // Arrange
        const { cpnGuard, router } = testSetup();
        const createUrlTree = jest.spyOn(router, 'createUrlTree');
        const productId = 540156111;
        const mockData = {
          queryParamMap: convertToParamMap({
            q: `CPN ${productId + authFacade.user.CompanyId}`,
          }),
        } as ActivatedRouteSnapshot;

        // Act
        cpnGuard.canActivate(mockData);

        // Assert
        expect(createUrlTree).toHaveBeenCalledWith(['/products', productId], {
          queryParams: {
            keywords: mockData.queryParamMap.get('q'),
          },
        });
      }
    ));

    it("shouldn't allow user to navigate to product detail page if CPN is not valid", () => {
      // Arrange
      const { cpnGuard, router } = testSetup();
      const createUrlTree = jest.spyOn(router, 'createUrlTree');

      const mockData = {
        queryParamMap: convertToParamMap({ q: 'hat' }),
      } as ActivatedRouteSnapshot;

      // Assert
      expect(cpnGuard.canActivate(mockData)).toBeTruthy();
      expect(createUrlTree).not.toHaveBeenCalled();
    });
  });
});
