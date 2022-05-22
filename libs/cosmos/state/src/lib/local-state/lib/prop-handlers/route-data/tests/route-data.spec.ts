import { Injectable } from '@angular/core';

import { freshPlatform } from '@cosmos/testing';

import { routeData } from '../route-data';
import { LocalState } from '../../../local-state';
import { setupRouteDataFixture } from './_setup-fixture';

describe('Route data prop handler', () => {
  it(
    'should retrieve the whole data when the key is not provided',
    freshPlatform(async () => {
      // Arrange & act
      @Injectable()
      class TestLocalState extends LocalState<TestLocalState> {
        data = routeData();
      }

      const { references } = await setupRouteDataFixture({
        TestLocalState,
        initialRouteUrl: '/first-page',
      });

      // Assert
      expect(references.state.data).toEqual({});
      expect(references.state.data).toBe(references.route.snapshot.data);
    })
  );

  it(
    'should pluck the specific property when the key is provided',
    freshPlatform(async () => {
      // Arrange
      const recorder: (string | undefined)[] = [];

      @Injectable()
      class TestLocalState extends LocalState<TestLocalState> {
        id = routeData<string>('id');
      }

      const { router, ngZone, references } = await setupRouteDataFixture({
        TestLocalState,
        initialRouteUrl: '/second-page/1',
      });

      references.connectedObservable.subscribe((state) => {
        recorder.push(state.id);
      });

      // Act
      await ngZone.run(() => router.navigateByUrl('/second-page/2'));
      await ngZone.run(() => router.navigateByUrl('/second-page/3'));

      // Assert
      expect(references.state.id).toEqual('3');
      expect(references.state.id).toEqual(references.route.snapshot.data.id);
    })
  );
});
