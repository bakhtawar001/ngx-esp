import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { getErrorMessage } from '@cosmos/testing';

import { LocalState } from '../../../local-state';
import { routeData, RouteDataErrorMessage } from '../route-data';

describe('routeData: error handling', () => {
  @Injectable()
  class TestLocalState extends LocalState<TestLocalState> {
    products = routeData<unknown[]>('products');
  }

  it('should throw an error when the `RouterModule` is not imported', () => {
    // Arrange
    let message: string | null = null;

    TestBed.configureTestingModule({
      providers: [TestLocalState],
    });

    // Act
    try {
      TestBed.inject(TestLocalState);
    } catch (error) {
      message = getErrorMessage(error);
    }

    // Assert
    expect(message).toEqual(RouteDataErrorMessage.RouteIsMissing);
  });

  it('should throw an error when the property value is being altered', () => {
    // Arrange
    let message: string | null = null;

    TestBed.configureTestingModule({
      providers: [
        TestLocalState,
        {
          provide: ActivatedRoute,
          useValue: { data: new BehaviorSubject({}) },
        },
      ],
    });

    // Act
    const state = TestBed.inject(TestLocalState);

    try {
      state.products = [];
    } catch (error) {
      message = getErrorMessage(error);
    }

    expect(message).toEqual(
      `'products' is a read-only property. It cannot be altered.`
    );
  });
});
