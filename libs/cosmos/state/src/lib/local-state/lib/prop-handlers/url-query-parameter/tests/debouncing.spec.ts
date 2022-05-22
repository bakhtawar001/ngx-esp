import { Injectable } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { freshPlatform, waitForNavigationToComplete } from '@cosmos/testing';
import { filter, map, scan } from 'rxjs/operators';
import { LocalState } from '../../../local-state';
import { urlQueryParameter } from '../url-query-parameter';
import { setupUrlQueryParameterFixture } from './_setup-fixture';

describe('urlQueryParameter: debouncing', () => {
  async function setup(options?: {
    debounceTime?: number;
    redirectGuardTargetUrl?: string[];
  }) {
    options = {
      debounceTime: 0,
      ...(options || {}),
    };
    @Injectable()
    class TestLocalState extends LocalState<TestLocalState> {
      categoryId = urlQueryParameter<number | null>('id', {
        debounceTime: options!.debounceTime,
        defaultValue: null,
        converter: {
          fromQuery: (queryParameterValues: string[]) =>
            queryParameterValues.length > 0
              ? parseInt(queryParameterValues[0], 10)
              : null,
          toQuery: (value: number) =>
            value !== null ? [value.toString()] : [],
        },
      });
    }

    const fixture = await setupUrlQueryParameterFixture({
      TestLocalState,
      redirectGuardTargetUrl: options.redirectGuardTargetUrl,
    });

    return {
      ...fixture,
      debounceTime: options.debounceTime,
    };
  }

  it(
    'should not navigate multiple times if the property is set multiple times in a row',
    freshPlatform(async () => {
      // Arrange & act
      const { router, state } = await setup({ debounceTime: 0 });
      const navigateSpy = jest.spyOn(router, 'navigate');

      state.categoryId = 123;
      state.categoryId = 456;
      state.categoryId = 789;
      await waitForNavigationToComplete(router);

      // Assert
      try {
        expect(router.url).toEqual('/page?id=789');
        expect(navigateSpy).toHaveBeenCalledTimes(1);
      } finally {
        navigateSpy.mockRestore();
      }
    })
  );

  it(
    'should debounce navigation with 500ms',
    freshPlatform(
      fakeAsync(async () => {
        // Arrange
        const debounceTime = 500;

        // Act
        const { router, state } = await setup({ debounceTime });
        const navigateSpy = jest.spyOn(router, 'navigate');

        state.categoryId = 123;
        tick(debounceTime - 100);
        state.categoryId = 456;
        tick(debounceTime - 100);
        state.categoryId = 789;
        tick(debounceTime);

        // Assert
        try {
          expect(router.url).toEqual('/page?id=789');
          expect(navigateSpy).toHaveBeenCalledTimes(1);
        } finally {
          navigateSpy.mockRestore();
        }
      })
    )
  );

  it(
    'should not navigate again if the property is set to the same value',
    freshPlatform(
      fakeAsync(async () => {
        // Arrange
        const debounceTime = 1;
        const { router, state } = await setup({ debounceTime });
        const navigateSpy = jest.spyOn(router, 'navigate');
        state.categoryId = 123;
        tick(debounceTime + 1);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        // Act
        state.categoryId = 123;
        // Assert
        try {
          tick(debounceTime + 1);
          expect(router.url).toEqual('/page?id=123');
          expect(navigateSpy).toHaveBeenCalledTimes(1);
        } finally {
          navigateSpy.mockRestore();
        }
      })
    )
  );

  it(
    'should not navigate again if the property is set to a different value and then the same value again within the debounce period',
    freshPlatform(
      fakeAsync(async () => {
        // Arrange
        const debounceTime = 100;
        const { router, state } = await setup({ debounceTime });
        const navigateSpy = jest.spyOn(router, 'navigate');
        state.categoryId = 123;
        tick(debounceTime + 1);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        state.categoryId = 234;
        tick(debounceTime - 1);
        // Act
        state.categoryId = 123;
        // Assert
        try {
          tick(debounceTime + 1);
          expect(router.url).toEqual('/page?id=123');
          expect(navigateSpy).toHaveBeenCalledTimes(1);
        } finally {
          navigateSpy.mockRestore();
        }
      })
    )
  );

  it(
    'should cancel debounced navigation if an internal page navigation occurs within the debounce period',
    freshPlatform(
      fakeAsync(async () => {
        // Arrange
        const debounceTime = 100;
        const { router, state, ngZone } = await setup({ debounceTime });
        state.categoryId = 123;
        tick(debounceTime - 1);
        // Act
        ngZone.run(() => {
          router.navigate([], {
            queryParams: {
              id: ['987'],
            },
            queryParamsHandling: 'merge',
          });
        });
        // Assert
        const navigateSpy = jest.spyOn(router, 'navigate');
        try {
          tick(debounceTime + 1);
          expect(navigateSpy).toHaveBeenCalledTimes(0);
          expect(router.url).toEqual('/page?id=987');
          expect(state.categoryId).toEqual(987);
        } finally {
          navigateSpy.mockRestore();
        }
      })
    )
  );

  it(
    'should cancel navigation if a different page navigation occurs during the debounce period',
    freshPlatform(
      fakeAsync(async () => {
        // Arrange
        const debounceTime = 2000;
        const { router, state, ngZone, resolveGuardPromise } = await setup({
          debounceTime,
        });
        state.categoryId = 123;
        tick(debounceTime - 1500);
        // Act
        ngZone.run(() => {
          router.navigateByUrl('/guarded-page');
        });
        tick(debounceTime + 1);
        resolveGuardPromise(true);
        tick(debounceTime);
        // Assert
        expect(router.url).toEqual('/guarded-page');
      })
    )
  );

  describe('[new page navigation while still debouncing]', () => {
    describe('(navigating to guarded page which succeeds)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'GuardsCheckEnd(0)',
        'ResolveStart(0)',
        'ResolveEnd(0)',
        'NavigationEnd(0)',
      ].forEach((testCase) => {
        it(
          `should not set query params on new page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone, resolveGuardPromise } =
                await setup({ debounceTime });
              routerEventName$(router)
                .pipe(filter((name) => name === testCase))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router.navigateByUrl('/guarded-page');
                tick(debounceTime);
                resolveGuardPromise(true);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/guarded-page');
            })
          )
        );
      });
    });
    describe('(navigating to guarded page which returns false)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'GuardsCheckEnd(0)',
        'NavigationCancel(0)',
        'NavigationStart(1)',
        'RoutesRecognized(1)',
        'GuardsCheckStart(1)',
        'GuardsCheckEnd(1)',
        'NavigationEnd(1)',
      ].forEach((testCase) => {
        it(
          `should still set query params on page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone, resolveGuardPromise } =
                await setup({ debounceTime });
              routerEventName$(router)
                .pipe(filter((name) => name === testCase))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router.navigateByUrl('/guarded-page');
                tick(debounceTime);
                resolveGuardPromise(false);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/page?id=123');
            })
          )
        );
      });
    });
    describe('(navigating to page with guard error)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'NavigationError(0)',
        'NavigationStart(1)',
        'RoutesRecognized(1)',
        'GuardsCheckStart(1)',
        'GuardsCheckEnd(1)',
        'NavigationEnd(1)',
      ].forEach((testCase) => {
        it(
          `should set query params on original page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone } = await setup({ debounceTime });
              routerEventName$(router)
                .pipe(filter((name) => name.includes(testCase)))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router
                  .navigateByUrl('/page/guarded-page-error')
                  .catch(() => {});
                tick(debounceTime);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/page?id=123');
            })
          )
        );
      });
    });

    describe('(navigating to guarded page which redirects back to same page)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'NavigationCancel(0)',
        'NavigationStart(1)',
        'RoutesRecognized(1)',
        'GuardsCheckStart(1)',
        'GuardsCheckEnd(1)',
        'NavigationEnd(1)',
      ].forEach((testCase) => {
        it(
          `should still set query params on page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone } = await setup({
                debounceTime,
                redirectGuardTargetUrl: ['/page'],
              });
              routerEventName$(router)
                .pipe(filter((name) => name === testCase))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router.navigateByUrl(
                  '/guarded-page-with-redirect'
                );
                tick(debounceTime);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/page?id=123');
            })
          )
        );
      });
    });

    describe('(navigating to guarded page which redirects to other page)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'NavigationCancel(0)',
        'NavigationStart(1)',
        'RoutesRecognized(1)',
        'GuardsCheckStart(1)',
        'GuardsCheckEnd(1)',
        'ResolveStart(1)',
        'ResolveEnd(1)',
        'NavigationEnd(1)',
      ].forEach((testCase) => {
        it(
          `should not set query params on new page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone } = await setup({
                debounceTime,
                redirectGuardTargetUrl: ['/other-page'],
              });
              routerEventName$(router)
                .pipe(filter((name) => name === testCase))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router.navigateByUrl(
                  '/guarded-page-with-redirect'
                );
                tick(debounceTime);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/other-page');
            })
          )
        );
      });
    });
  });

  describe('[child page navigation while still debouncing]', () => {
    describe('(navigating to child page which succeeds)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'GuardsCheckEnd(0)',
        'ResolveStart(0)',
        'ResolveEnd(0)',
        'NavigationEnd(0)',
      ].forEach((testCase) => {
        it(
          `should set query params on new child page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone } = await setup({ debounceTime });
              routerEventName$(router)
                .pipe(filter((name) => name.includes(testCase)))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router.navigateByUrl('/page/child-page');
                tick(debounceTime);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/page/child-page?id=123');
            })
          )
        );
      });
    });
    describe('(navigating to guarded child page which succeeds)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'GuardsCheckEnd(0)',
        'ResolveStart(0)',
        'ResolveEnd(0)',
        'NavigationEnd(0)',
      ].forEach((testCase) => {
        it(
          `should set query params on new child page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone, resolveGuardPromise } =
                await setup({ debounceTime });
              routerEventName$(router)
                .pipe(filter((name) => name.includes(testCase)))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router.navigateByUrl(
                  '/page/guarded-child-page'
                );
                tick(debounceTime);
                resolveGuardPromise(true);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/page/guarded-child-page?id=123');
            })
          )
        );
      });
    });
    describe('(navigating to guarded child page which returns false)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'GuardsCheckEnd(0)',
        'NavigationCancel(0)',
        'NavigationStart(1)',
        'RoutesRecognized(1)',
        'GuardsCheckStart(1)',
        'GuardsCheckEnd(1)',
        'NavigationEnd(1)',
      ].forEach((testCase) => {
        it(
          `should set query params on original page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone, resolveGuardPromise } =
                await setup({ debounceTime });
              routerEventName$(router)
                .pipe(filter((name) => name.includes(testCase)))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router.navigateByUrl(
                  '/page/guarded-child-page'
                );
                tick(debounceTime);
                resolveGuardPromise(false);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/page?id=123');
            })
          )
        );
      });
    });
    describe('(navigating to child page with guard error)', () => {
      [
        'NavigationStart(0)',
        'RoutesRecognized(0)',
        'GuardsCheckStart(0)',
        'NavigationError(0)',
        'NavigationStart(1)',
        'RoutesRecognized(1)',
        'GuardsCheckStart(1)',
        'GuardsCheckEnd(1)',
        'NavigationEnd(1)',
      ].forEach((testCase) => {
        it(
          `should set query params on original page (case: debounce resolves at '${testCase}' event)`,
          freshPlatform(
            fakeAsync(async () => {
              // Arrange
              const debounceTime = 2000;
              const { router, state, ngZone } = await setup({ debounceTime });
              routerEventName$(router)
                .pipe(filter((name) => name.includes(testCase)))
                .subscribe(() => {
                  tick(debounceTime + 1);
                });
              state.categoryId = 123;
              // Act
              await ngZone.run(async () => {
                const promise = router
                  .navigateByUrl('/page/guarded-child-error')
                  .catch(() => {});
                tick(debounceTime);
                await promise;
              });

              // Assert
              tick(debounceTime);
              expect(router.url).toEqual('/page?id=123');
            })
          )
        );
      });
    });
  });

  describe('[child page navigation]', () => {
    describe('(navigating to child page)', () => {
      it(
        `should maintain query params on new child page (when queryParamsHandling: 'preserve')`,
        freshPlatform(
          fakeAsync(async () => {
            // Arrange
            const debounceTime = 0;
            const { router, state, ngZone } = await setup({ debounceTime });
            state.categoryId = 123;
            tick(debounceTime);
            // Act
            await ngZone.run(async () => {
              const promise = router.navigate(['/page/child-page'], {
                queryParamsHandling: 'preserve',
                queryParams: { id: 234 },
              });
              tick(debounceTime);
              await promise;
            });

            // Assert
            tick(debounceTime);
            expect(router.url).toEqual('/page/child-page?id=123');
            expect(state.categoryId).toEqual(123);
          })
        )
      );
      it(
        `should maintain query params on new child page (when queryParamsHandling: 'merge')`,
        freshPlatform(
          fakeAsync(async () => {
            // Arrange
            const debounceTime = 0;
            const { router, state, ngZone } = await setup({ debounceTime });
            state.categoryId = 123;
            tick(debounceTime);
            // Act
            await ngZone.run(async () => {
              const promise = router.navigate(['/page/child-page'], {
                queryParamsHandling: 'merge',
              });
              tick(debounceTime);
              await promise;
            });

            // Assert
            tick(debounceTime);
            expect(router.url).toEqual('/page/child-page?id=123');
            expect(state.categoryId).toEqual(123);
          })
        )
      );
      it(
        `should use new query params on new child page (when queryParamsHandling: 'merge')`,
        freshPlatform(
          fakeAsync(async () => {
            // Arrange
            const debounceTime = 0;
            const { router, state, ngZone } = await setup({ debounceTime });
            state.categoryId = 123;
            tick(debounceTime);
            // Act
            await ngZone.run(async () => {
              const promise = router.navigate(['/page/child-page'], {
                queryParams: { id: 234 },
                queryParamsHandling: 'merge',
              });
              tick(debounceTime);
              await promise;
            });

            // Assert
            tick(debounceTime);
            expect(router.url).toEqual('/page/child-page?id=234');
            expect(state.categoryId).toEqual(234);
          })
        )
      );
      it(
        `should reset query params on new child page (when no preserve params)`,
        freshPlatform(
          fakeAsync(async () => {
            // Arrange
            const debounceTime = 0;
            const { router, state, ngZone } = await setup({ debounceTime });
            state.categoryId = 123;
            tick(debounceTime);
            // Act
            await ngZone.run(async () => {
              const promise = router.navigate(['/page/child-page']);
              tick(debounceTime);
              await promise;
            });

            // Assert
            tick(debounceTime);
            expect(router.url).toEqual('/page/child-page');
            expect(state.categoryId).toEqual(null);
          })
        )
      );
      it(
        `should use new query params from child page nav (when no preserve params)`,
        freshPlatform(
          fakeAsync(async () => {
            // Arrange
            const debounceTime = 0;
            const { router, state, ngZone } = await setup({ debounceTime });
            state.categoryId = 123;
            tick(debounceTime);
            // Act
            await ngZone.run(async () => {
              const promise = router.navigate(['/page/child-page'], {
                queryParams: { id: 234 },
              });
              tick(debounceTime);
              await promise;
            });

            // Assert
            tick(debounceTime);
            expect(router.url).toEqual('/page/child-page?id=234');
            expect(state.categoryId).toEqual(234);
          })
        )
      );
    });
    describe('(navigating to guarded child page which returns false)', () => {
      it(
        `should set query params on original page`,
        freshPlatform(
          fakeAsync(async () => {
            // Arrange
            const debounceTime = 0;
            const { router, state, ngZone, resolveGuardPromise } = await setup({
              debounceTime,
            });
            state.categoryId = 123;
            tick(debounceTime);
            // Act
            await ngZone.run(async () => {
              const promise = router.navigateByUrl('/page/guarded-child-page');
              resolveGuardPromise(false);
              tick(debounceTime);
              await promise;
            });

            // Assert
            tick(debounceTime);
            expect(router.url).toEqual('/page?id=123');
          })
        )
      );
    });
    describe('(navigating to child page with guard error)', () => {
      it(
        `should set query params on original page`,
        freshPlatform(
          fakeAsync(async () => {
            // Arrange
            const debounceTime = 0;
            const { router, state, ngZone } = await setup({
              debounceTime,
            });
            state.categoryId = 123;
            tick(debounceTime);
            // Act
            await ngZone.run(async () => {
              const promise = router
                .navigateByUrl('/page/guarded-child-error')
                .catch(() => {});
              tick(debounceTime);
              await promise;
            });

            // Assert
            tick(debounceTime);
            expect(router.url).toEqual('/page?id=123');
          })
        )
      );
    });
  });
});

function routerEventName$(router: Router, startIndex = 0) {
  return router.events.pipe(
    filter((e): e is RouterEvent => e instanceof RouterEvent),
    scan(
      (acc, event) => ({
        event,
        navStarts: acc.navStarts + (event instanceof NavigationStart ? 1 : 0),
      }),
      {
        event: null as unknown as RouterEvent,
        navStarts: startIndex - 1,
      }
    ),
    map((item) => `${item.event.constructor.name}(${item.navStarts})`)
  );
}
