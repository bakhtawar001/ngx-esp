import { Injectable, NgZone } from '@angular/core';
import {
  freshPlatform,
  TestRecorder,
  waitForNavigationToComplete,
} from '@cosmos/testing';
import { LocalState } from '../../../local-state';
import { urlQueryParameter } from '../url-query-parameter';
import { setupUrlQueryParameterFixture } from './_setup-fixture';

describe('urlQueryParameter: zone stuff', () => {
  async function setup() {
    @Injectable()
    class TestLocalState extends LocalState<TestLocalState> {
      categoryId = urlQueryParameter<number | null>('id', {
        debounceTime: 0,
        defaultValue: null,
        converter: {
          fromQuery: (queryParameterValues: string[]) =>
            queryParameterValues.length > 0
              ? parseInt(queryParameterValues[0], 10)
              : null,
          toQuery: (value: number) =>
            typeof value === 'number' ? [value.toString()] : [],
        },
      });
    }

    const fixture = await setupUrlQueryParameterFixture({
      TestLocalState,
    });

    return {
      ...fixture,
    };
  }

  it(
    'connect() observable should emit within the Angular zone',
    freshPlatform(async () => {
      // Arrange
      const {
        router,
        state,
        componentNotifyZoneRecorder,
        everythingReady,
      } = await setup();
      await everythingReady;
      // Act
      state.categoryId = 123;
      await waitForNavigationToComplete(router);
      // Assert
      expect(componentNotifyZoneRecorder.items).toEqual([
        'InAngularZone',
        'InAngularZone',
      ]);
    })
  );

  it(
    'connect() observable should emit within the Angular zone even if the property is set outside',
    freshPlatform(async () => {
      // Arrange
      const {
        router,
        ngZone,
        state,
        componentNotifyZoneRecorder,
        everythingReady,
      } = await setup();
      await everythingReady;
      componentNotifyZoneRecorder.reset();
      // Act
      ngZone.runOutsideAngular(() => {
        state.categoryId = 123;
      });
      // Assert
      await waitForNavigationToComplete(router);
      expect(componentNotifyZoneRecorder.items).toEqual(['InAngularZone']);
    })
  );

  it(
    'router.navigate() should be called within the Angular zone',
    freshPlatform(async () => {
      // Arrange
      const navigateCallsWithinTheAngularZone = new TestRecorder<string>();
      const { router, state } = await setup();
      const navigate = router.navigate;
      const navigateSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation((commands, extras) => {
          navigateCallsWithinTheAngularZone.record(
            NgZone.isInAngularZone() ? 'InAngularZone' : 'OutsideAngularZone'
          );
          return navigate.call(router, commands, extras);
        });

      // Act
      state.categoryId = 123;
      await waitForNavigationToComplete(router);

      state.categoryId = 456;
      await waitForNavigationToComplete(router);

      // Assert
      try {
        expect(navigateSpy).toHaveBeenCalledTimes(2);
        expect(navigateCallsWithinTheAngularZone.items).toEqual([
          'InAngularZone',
          'InAngularZone',
        ]);
      } finally {
        navigateSpy.mockRestore();
      }
    })
  );
});
