import { Injectable, Type } from '@angular/core';
import { freshPlatform, waitForNavigationToComplete } from '@cosmos/testing';
import { LocalState } from '../../../local-state';
import {
  urlQueryParameter,
  UrlQueryParameterConverter,
} from '../url-query-parameter';
import { setupUrlQueryParameterFixture } from './_setup-fixture';

const basicNumberConverter: UrlQueryParameterConverter<number> = {
  fromQuery(paramValues: string[], defaultValue: number, currentValue: number) {
    return paramValues.length > 0 ? parseInt(paramValues[0], 10) : defaultValue;
  },
  toQuery(value: number, defaultValue: number, currentParamValues: string[]) {
    return typeof value === 'number' ? [value.toString()] : [];
  },
};

describe('Url query parameter prop handler', () => {
  async function setup<T extends LocalState<T>>(options: {
    TestLocalState: Type<T>;
    initialRouteUrl?: string;
  }) {
    return await setupUrlQueryParameterFixture(options);
  }

  describe('[param value handling]', () => {
    it(
      'should navigate with query parameters when the value is set',
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          categoryId = urlQueryParameter<number | null>('id', {
            debounceTime: 0,
            defaultValue: null,
            converter: basicNumberConverter,
          });
        }

        // Act
        const { router, state } = await setup({ TestLocalState });

        state.categoryId = 123;
        await waitForNavigationToComplete(router);

        // Assert
        expect(state.categoryId).toEqual(123);
        expect(router.url).toEqual('/page?id=123');
      })
    );

    it(
      'should navigate with multiple query parameters when `toQuery` returns an array of parameters',
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          filters = urlQueryParameter<string[] | null>('filter', {
            debounceTime: 0,
            defaultValue: null,
            converter: {
              fromQuery: (queryParameterValues: string[]) =>
                queryParameterValues,
              toQuery: (value: string[]) => value,
            },
          });
        }

        // Act
        const { router, state } = await setup({ TestLocalState });

        state.filters = ['red', 'white'];
        await waitForNavigationToComplete(router);

        // Assert
        expect(state.filters).toEqual(['red', 'white']);
        expect(router.url).toEqual('/page?filter=red&filter=white');
      })
    );

    it(
      `should clear parameters when 'toQuery' returns an empty array`,
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          categoryId = urlQueryParameter<number>('id', {
            debounceTime: 0,
            defaultValue: 456,
            converter: {
              fromQuery: (
                queryParameterValues: string[],
                defaultValue: number
              ) =>
                queryParameterValues.length > 0
                  ? +queryParameterValues[0]
                  : defaultValue,
              toQuery: (value, defaultValue, currentParams) =>
                value === defaultValue ? [] : [value.toString()],
            },
          });
        }

        // Act
        const { ngZone, router, state } = await setup({ TestLocalState });

        await ngZone.run(() =>
          router.navigate([], {
            queryParams: {
              id: '123',
            },
          })
        );

        // Assert
        expect(state.categoryId).toEqual(123);
        expect(router.url).toEqual('/page?id=123');

        state.categoryId = 456;
        await waitForNavigationToComplete(router);

        expect(router.url).toEqual('/page');
        expect(state.categoryId).toEqual(456);
      })
    );
  });
  describe('[navigation history]', () => {
    it(
      'should navigate back when the popstate is dispatched',
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          filters = urlQueryParameter<string[] | null>('filter', {
            debounceTime: 0,
            defaultValue: null,
            converter: {
              fromQuery: (queryParameterValues: string[]) =>
                queryParameterValues,
              toQuery: (value: string[]) => value,
            },
          });
        }

        // Act
        const { router, location, state } = await setup({ TestLocalState });

        state.filters = ['red'];
        await waitForNavigationToComplete(router);

        // Assert
        expect(state.filters).toEqual(['red']);
        expect(router.url).toEqual('/page?filter=red');

        state.filters = ['red', 'white'];
        await waitForNavigationToComplete(router);

        expect(state.filters).toEqual(['red', 'white']);
        expect(router.url).toEqual('/page?filter=red&filter=white');

        location.back();
        await waitForNavigationToComplete(router);

        expect(state.filters).toEqual(['red']);
        expect(router.url).toEqual('/page?filter=red');
      })
    );
  });

  describe('[default value handling]', () => {
    it(
      'should start with the default value',
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          categoryId = urlQueryParameter<number>('id', {
            debounceTime: 0,
            defaultValue: 999,
            converter: basicNumberConverter,
          });
        }

        const { state } = await setup({ TestLocalState });
        // Act
        const currentValue = state.categoryId;
        // Assert
        expect(currentValue).toEqual(999);
      })
    );

    it(
      'should override the default value with the value from the url',
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          categoryId = urlQueryParameter<number>('id', {
            debounceTime: 0,
            defaultValue: 999,
            converter: basicNumberConverter,
          });
        }

        const { state, everythingReady } = await setup({
          TestLocalState,
          initialRouteUrl: '/page?id=777',
        });
        await everythingReady;
        // Act
        const currentValue = state.categoryId;
        // Assert
        expect(currentValue).toEqual(777);
      })
    );

    it(
      'should preserve the value in the url on init when default specified',
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          categoryId = urlQueryParameter<number>('id', {
            debounceTime: 0,
            defaultValue: 999,
            converter: basicNumberConverter,
          });
        }

        const { state, router, everythingReady } = await setup({
          TestLocalState,
          initialRouteUrl: '/page?id=777',
        });
        await everythingReady;
        // Act
        const routerUrl = router.url;
        // Assert
        expect(routerUrl).toEqual('/page?id=777');
      })
    );

    it(
      'should preserve the value in the url on init when default is not specified',
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          categoryId = urlQueryParameter<number | null>('id', {
            debounceTime: 0,
            defaultValue: null,
            converter: basicNumberConverter,
          });
        }

        const { state, router, everythingReady } = await setup({
          TestLocalState,
          initialRouteUrl: '/page?id=777',
        });
        await everythingReady;
        // Act
        const routerUrl = router.url;
        // Assert
        expect(routerUrl).toEqual('/page?id=777');
      })
    );

    it(
      'should reflect the converted default value in the url when the converter returns default',
      freshPlatform(async () => {
        // Arrange
        @Injectable()
        class TestLocalState extends LocalState<TestLocalState> {
          categoryId = urlQueryParameter<number>('id', {
            debounceTime: 0,
            defaultValue: 999,
            converter: basicNumberConverter,
          });
        }

        const { router, everythingReady } = await setup({
          TestLocalState,
          initialRouteUrl: '/page',
        });
        await everythingReady;

        // Act
        const routerUrl = router.url;
        // Assert
        expect(routerUrl).toEqual('/page?id=999');
      })
    );
  });

  it(
    'should notify the connected observable when the value is set',
    freshPlatform(async () => {
      // Arrange
      @Injectable()
      class TestLocalState extends LocalState<TestLocalState> {
        categoryId = urlQueryParameter<number>('id', {
          debounceTime: 0,
          converter: basicNumberConverter,
        });
      }

      const { state, component } = await setup({ TestLocalState });

      let notifiedValues: number[] = [];
      state
        .connect(component)
        .subscribe((val) => notifiedValues.push(val.categoryId!));
      notifiedValues = [];
      // Act
      state.categoryId = 123;
      // Assert
      expect(notifiedValues).toEqual([123]);
    })
  );
});
