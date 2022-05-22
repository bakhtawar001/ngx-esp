import { Router, UrlTree } from '@angular/router';
import { FeatureFlagsRouteData } from '../models';
import { ExplicitFeatureFlagsService } from '../services';
import { FeatureFlagsGuard } from './feature-flags.guard';

type RouteWithFeatureFlagsData = {
  path?: string;
  data?: FeatureFlagsRouteData;
};

describe('Component: FeatureFlagsGuard', () => {
  const setupFixture = (options: { flags: Record<string, boolean> }) => {
    const fakeRouter = {
      createUrlTree(commands) {
        const fakeUrlTree = { toString: () => commands.join('/') };
        Object.setPrototypeOf(fakeUrlTree, UrlTree.prototype);
        return fakeUrlTree;
      },
    } as Partial<Router> as Router;
    const explicitFeatureFlagsService = new ExplicitFeatureFlagsService();
    explicitFeatureFlagsService.setFlags(options.flags);
    const instance = new FeatureFlagsGuard(
      fakeRouter,
      explicitFeatureFlagsService
    );
    return {
      instance,
      fakeRouter,
      fakeFeatureFlagsService: explicitFeatureFlagsService,
    };
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      return;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // We have the same test for all the route guards methods
  // So that, we are keeping the same behaviour as before
  (['canActivateChild', 'canLoad', 'canActivate'] as const).forEach(
    (method) => {
      describe(`#${method}()`, () => {
        it('should return `false` if specified feature flag does not exist', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            path: 'home',
            data: {
              featureFlags: {
                matches: ['thisFeatureToggleDoesNotExist'],
              },
            },
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeFalsy();
        });

        it('should return `false` if no route data', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            path: 'home',
            data: undefined,
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeFalsy();
          expect(console.error).toHaveBeenCalledWith(
            'The `FeatureFlagsGuard` requires `featureFlags.matches` to be set to an array or string value in the `data` of your route configuration.',
            route
          );
        });

        it('should return `false` if `featureFlags` key does not exist in route data', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            path: 'home',
            data: {},
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeFalsy();
          expect(console.error).toHaveBeenCalledWith(
            'The `FeatureFlagsGuard` requires `featureFlags.matches` to be set to an array or string value in the `data` of your route configuration.',
            route
          );
        });

        it('should return `false` if `featureFlags` key exists in route data but `matches` sub key does not exist', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            path: 'home',
            data: {},
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeFalsy();
          expect(console.error).toHaveBeenCalledWith(
            'The `FeatureFlagsGuard` requires `featureFlags.matches` to be set to an array or string value in the `data` of your route configuration.',
            route
          );
        });

        it('should return `false` if `featureFlags.matches` is not added in route as an array or string', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route = {
            data: {
              featureFlags: {
                matches: {},
              },
            },
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeFalsy();
          expect(console.error).toHaveBeenCalledWith(
            'The `FeatureFlagsGuard` requires `featureFlags.matches` to be set to an array or string value in the `data` of your route configuration.',
            route
          );
        });

        it('should return `false` if specified feature flag is disabled', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            data: {
              featureFlags: {
                matches: ['isSecondFeatureEnabled'],
              },
            },
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeFalsy();
        });

        it('should return `false` and redirect to the specific URL if specified feature flag is disabled AND route contains `noMatchRedirectsTo`', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            data: {
              featureFlags: {
                matches: ['isSecondFeatureEnabled'],
                noMatchRedirectsTo: '/redirect-url',
              },
            },
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeInstanceOf(UrlTree);
          expect(result.toString()).toEqual('/redirect-url');
        });

        it('should return `true` if specified feature flag is enabled', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            data: {
              featureFlags: {
                matches: ['isFirstFeatureEnabled'],
              },
            },
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeTruthy();
        });

        it('should return `true` if specified feature flag is disabled AND route configuration starts with `!`', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            data: {
              featureFlags: {
                matches: ['!isSecondFeatureEnabled'],
              },
            },
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeTruthy();
        });

        it('should return `true` if combination of feature flags are truthy', () => {
          // Arrange
          const { instance } = setupFixture({
            flags: {
              isFirstFeatureEnabled: true,
              isSecondFeatureEnabled: false,
            },
          });
          const route: RouteWithFeatureFlagsData = {
            data: {
              featureFlags: {
                matches: ['isFirstFeatureEnabled', '!isSecondFeatureEnabled'],
              },
            },
          };
          // Act
          const result = instance[method](route);
          // Assert
          expect(result).toBeTruthy();
        });
      });
    }
  );
});
