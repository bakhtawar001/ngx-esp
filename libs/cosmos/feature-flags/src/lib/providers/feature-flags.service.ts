import { Injectable, Provider, Type } from '@angular/core';
import { Observable, of } from 'rxjs';

export function provideFeatureFlagsService(
  featureFlagsServiceType: Type<FeatureFlagsService>
) {
  return [
    {
      provide: FeatureFlagsService,
      useExisting: featureFlagsServiceType,
    },
  ] as Provider[];
}

@Injectable({
  providedIn: 'root',
  useFactory: () => new FallbackFeatureFlagsService(),
})
export abstract class FeatureFlagsService<
  TFeatureFlags extends string = string
> {
  abstract isEnabled(flagIdentifier: TFeatureFlags): boolean;
  abstract isEnabled$(flagIdentifier: TFeatureFlags): Observable<boolean>;
}

class FallbackFeatureFlagsService extends FeatureFlagsService {
  private _featureFlagWarningShown = false;

  private showWarning() {
    if (!this._featureFlagWarningShown) {
      this._featureFlagWarningShown = true;
      console.error(
        'WARNNING: The Feature Flags service should explicitly be provided for the application. All flags defaulting to false.'
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEnabled(flagIdentifier: string): boolean {
    this.showWarning();
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEnabled$(flagIdentifier: string): Observable<boolean> {
    this.showWarning();
    return of(false);
  }
}
