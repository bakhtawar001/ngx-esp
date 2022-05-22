import { TestBed } from '@angular/core/testing';
import { FeatureFlagsModule } from './feature-flags.module';
import { FeatureFlagsService } from './providers';
import { ExplicitFeatureFlagsService } from './services';

describe('FeatureFlagsModule', () => {
  const setupFixture = (
    options: {
      imports?: any[];
    } = {}
  ) => {
    const testBed = TestBed.configureTestingModule({
      imports: [options.imports || []],
    });
    return {
      inject: testBed.inject,
    };
  };

  it('should use the fallback if forRoot not called', () => {
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
      imports: [FeatureFlagsModule.forRoot(ExplicitFeatureFlagsService)],
    });
    // Act
    const result = inject(FeatureFlagsService);
    // Assert
    expect(result.constructor.name).toEqual('ExplicitFeatureFlagsService');
  });
});
