import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { getErrorMessage } from '@cosmos/testing';

import { LocalState } from '../../../local-state';
import {
  urlQueryParameter,
  UrlQueryParameterErrorMessage,
} from '../url-query-parameter';

describe('urlQueryParameter: error handling', () => {
  describe('error handling for parameter name', () => {
    it('should throw an error when parameter name is undefined', () => {
      // Arrange
      let message: string | null = null;

      // Act
      try {
        urlQueryParameter<never>(<any>undefined, <any>{});
      } catch (error) {
        message = getErrorMessage(error);
      }

      // Assert
      expect(message).toEqual(UrlQueryParameterErrorMessage.ParameterName);
    });

    it('should throw an error when parameter name is null', () => {
      // Arrange
      let message: string | null = null;

      // Act
      try {
        urlQueryParameter<never>(<any>null, <any>{});
      } catch (error) {
        message = getErrorMessage(error);
      }

      // Assert
      expect(message).toEqual(UrlQueryParameterErrorMessage.ParameterName);
    });

    it('should throw an error when parameter name is an empty string', () => {
      // Arrange
      let message: string | null = null;

      // Act
      try {
        urlQueryParameter<never>('', <any>{});
      } catch (error) {
        message = getErrorMessage(error);
      }

      // Assert
      expect(message).toEqual(UrlQueryParameterErrorMessage.ParameterName);
    });
  });

  describe('error handling for options', () => {
    it('should throw an error when options are undefined', () => {
      // Arrange
      let message: string | null = null;

      // Act
      try {
        urlQueryParameter<never>('parameterName', <any>undefined);
      } catch (error) {
        message = getErrorMessage(error);
      }

      // Assert
      expect(message).toEqual(UrlQueryParameterErrorMessage.Options);
    });

    it('should throw an error when options are null', () => {
      // Arrange
      let message: string | null = null;

      // Act
      try {
        urlQueryParameter<never>('parameterName', <any>null);
      } catch (error) {
        message = getErrorMessage(error);
      }

      // Assert
      expect(message).toEqual(UrlQueryParameterErrorMessage.Options);
    });

    it('should throw an error when converter is not provided', () => {
      // Arrange
      let message: string | null = null;

      // Act
      try {
        urlQueryParameter<never>('parameterName', <any>{});
      } catch (error) {
        message = getErrorMessage(error);
      }

      // Assert
      expect(message).toEqual(UrlQueryParameterErrorMessage.Converter);
    });
  });

  describe('error handling for the `Router` injectee', () => {
    it('should throw an error when was not able to inject the `Router`', () => {
      // Arrange
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
              value !== null ? [value.toString()] : [],
          },
        });
      }

      let message: string | null = null;

      // Act
      TestBed.configureTestingModule({
        providers: [TestLocalState],
      });

      try {
        TestBed.inject(TestLocalState);
      } catch (error) {
        message = getErrorMessage(error);
      }

      // Assert
      expect(message).toEqual(UrlQueryParameterErrorMessage.RouterIsMissing);
    });
  });
});
