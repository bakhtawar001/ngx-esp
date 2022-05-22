import { Injectable, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideFeatureFlagsService } from '.';
import { ExplicitFeatureFlagsService } from '../services';
import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  @Injectable()
  class TestService {
    constructor(public featureFlagsService: FeatureFlagsService) {}
  }

  const setupFixture = (
    options: {
      providers?: Provider[];
    } = {}
  ) => {
    const testBed = TestBed.configureTestingModule({
      providers: [TestService, options.providers || []],
    });
    return {
      inject: testBed.inject,
    };
  };

  it('should use the fallback if no provider specified', () => {
    // Arrange
    const { inject } = setupFixture();
    // Act
    const result = inject(FeatureFlagsService);
    // Assert
    expect(result.constructor.name).toEqual('FallbackFeatureFlagsService');
  });

  it('should allow for the root provider to be overridden', () => {
    // Arrange
    const { inject } = setupFixture({
      providers: [provideFeatureFlagsService(ExplicitFeatureFlagsService)],
    });
    // Act
    const result = inject(FeatureFlagsService);
    // Assert
    expect(result.constructor.name).toEqual('ExplicitFeatureFlagsService');
  });
});
