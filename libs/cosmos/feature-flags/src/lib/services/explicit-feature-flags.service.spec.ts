import { TestBed } from '@angular/core/testing';
import { FeatureFlagsModule } from '../feature-flags.module';
import { FeatureFlagsService } from '../providers';
import { ExplicitFeatureFlagsService } from './explicit-feature-flags.service';

describe('ExplicitFeatureFlagsService', () => {
  const setupFixture = <TFeatureFlags extends string = 'flagOne' | 'flagTwo'>(
    options: {
      imports?: any[];
    } = {}
  ) => {
    const testBed = TestBed.configureTestingModule({
      imports: [FeatureFlagsModule.forRoot(ExplicitFeatureFlagsService)],
    });
    return {
      inject: testBed.inject,
      service: testBed.inject(
        ExplicitFeatureFlagsService
      ) as ExplicitFeatureFlagsService<TFeatureFlags>,
    };
  };

  it('should allow for setup as a FeatureFlagService', () => {
    // Arrange
    const { inject } = setupFixture({
      imports: [FeatureFlagsModule.forRoot(ExplicitFeatureFlagsService)],
    });
    // Act
    const result = inject(FeatureFlagsService);
    // Assert
    expect(result.constructor.name).toEqual('ExplicitFeatureFlagsService');
  });

  describe(`[isEnabled]`, () => {
    it('should return `true` if flag is set up as `true`', () => {
      // Arrange
      const { service } = setupFixture<'flagOne' | 'flagTwo'>();
      service.setFlags({ flagOne: true });
      // Act
      const result = service.isEnabled('flagOne');
      // Assert
      expect(result).toBe(true);
    });

    it('should return `false` if flag is set up as `false`', () => {
      // Arrange
      const { service } = setupFixture<'flagOne' | 'flagTwo'>();
      service.setFlags({ flagOne: false });
      // Act
      const result = service.isEnabled('flagOne');
      // Assert
      expect(result).toBe(false);
    });

    it('should return `false` if flag is not set up', () => {
      // Arrange
      const { service } = setupFixture<'flagOne' | 'flagTwo'>();
      service.setFlags({ flagOne: true });
      // Act
      const result = service.isEnabled('flagTwo');
      // Assert
      expect(result).toBe(false);
    });

    it('should return `false` if setFlags was not called', () => {
      // Arrange
      const { service } = setupFixture<'flagOne' | 'flagTwo'>();
      // Act
      const result = service.isEnabled('flagOne');
      // Assert
      expect(result).toBe(false);
    });
  });
});
