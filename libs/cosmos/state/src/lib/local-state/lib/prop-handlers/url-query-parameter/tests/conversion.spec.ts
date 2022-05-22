import { ErrorHandler, Injectable, Type } from '@angular/core';
import { freshPlatform, TestRecorder } from '@cosmos/testing';
import { LocalState } from '../../../local-state';
import { urlQueryParameter } from '../url-query-parameter';
import { setupUrlQueryParameterFixture } from './_setup-fixture';

describe('urlQueryParameter: conversion', () => {
  async function setup<T extends LocalState<T>>(TestLocalState: Type<T>) {
    const angularErrorRecorder = new TestRecorder<any>();
    const capturingErrorHandler: ErrorHandler = {
      handleError(error: any): void {
        angularErrorRecorder.record(error);
      },
    };

    const fixture = await setupUrlQueryParameterFixture({
      TestLocalState,
      errorHandler: capturingErrorHandler,
    });

    return {
      ...fixture,
      angularErrorRecorder,
    };
  }

  it(
    'should revert to the default value if `fromQuery` conversion fails',
    freshPlatform(async () => {
      // Arrange
      let shouldThrow = false;
      const defaultValue = 123456789;
      const error = new TypeError('This is just some dummy error...');

      @Injectable()
      class TestLocalState extends LocalState<TestLocalState> {
        categoryId = urlQueryParameter<number | null>('id', {
          defaultValue,
          debounceTime: 0,
          converter: {
            fromQuery: (queryParameterValues: string[]) => {
              if (shouldThrow) {
                // We're explicitly throwing an error to test that case.
                throw error;
              }

              return queryParameterValues.length > 0
                ? parseInt(queryParameterValues[0], 10)
                : null;
            },
            toQuery: (value: number) =>
              value !== null ? [value.toString()] : [],
          },
        });
      }

      const { state, router, ngZone, angularErrorRecorder } = await setup(
        TestLocalState
      );

      // Act
      await ngZone.run(() =>
        router.navigate([], {
          queryParams: {
            id: '333',
          },
        })
      );

      // Assert
      expect(state.categoryId).toEqual(333);

      shouldThrow = true;
      await ngZone.run(() =>
        router.navigate([], {
          queryParams: {
            id: '444',
          },
        })
      );

      // Ensure that an error has been thrown and the state is reverted back to the default value.
      expect(state.categoryId).toEqual(defaultValue);
      expect(angularErrorRecorder.items).toContain(error);
    })
  );

  it(
    'should throw an error on the stack if `toQuery` fails',
    freshPlatform(async () => {
      // Arrange
      let caughtError: TypeError | null = null;
      const error = new TypeError('This is just some dummy error...');
      const magicValueToTriggerError = 123;

      @Injectable()
      class TestLocalState extends LocalState<TestLocalState> {
        categoryId = urlQueryParameter<number | null>('id', {
          defaultValue: 0,
          debounceTime: 0,
          converter: {
            fromQuery: (queryParameterValues: string[]) => {
              return queryParameterValues.length > 0
                ? parseInt(queryParameterValues[0], 10)
                : null;
            },
            toQuery: (value) => {
              if (value === magicValueToTriggerError) {
                // We're explicitly throwing an error to test that case.
                throw error;
              }
              return typeof value === 'number' ? [value.toString()] : [];
            },
          },
        });
      }

      const { state } = await setup(TestLocalState);

      // Act
      try {
        state.categoryId = magicValueToTriggerError;
      } catch (error) {
        if (error instanceof TypeError) {
          caughtError = error;
        }
      }

      // Assert
      expect(caughtError).toEqual(error);
    })
  );
});
