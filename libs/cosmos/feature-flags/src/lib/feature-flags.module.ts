import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { IfFeatureFlagsDirective } from './directives';
import { FeatureFlagsService, provideFeatureFlagsService } from './providers';

@NgModule({
  imports: [CommonModule],
  declarations: [IfFeatureFlagsDirective],
  exports: [IfFeatureFlagsDirective],
})
export class FeatureFlagsModule {
  static forRoot(
    featureFlagsServiceType: Type<FeatureFlagsService>
  ): ModuleWithProviders<FeatureFlagsModule> {
    return {
      ngModule: FeatureFlagsModule,
      providers: [...provideFeatureFlagsService(featureFlagsServiceType)],
    };
  }
}
