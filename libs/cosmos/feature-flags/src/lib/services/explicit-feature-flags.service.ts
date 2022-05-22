import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FeatureFlagsService } from '../providers';

export type ExplicitFeatureFlagsMap<TFeatureFlags extends string> = Record<
  TFeatureFlags,
  boolean
>;

@Injectable({ providedIn: 'root' })
export class ExplicitFeatureFlagsService<
  TFeatureFlags extends string = string
> extends FeatureFlagsService<TFeatureFlags> {
  private _flags: Partial<Record<TFeatureFlags, boolean>> = {};

  static provideWithConfig<TFeatureFlags extends string>(
    flags: ExplicitFeatureFlagsMap<TFeatureFlags>
  ): Provider {
    return {
      provide: ExplicitFeatureFlagsService,
      useFactory: () => {
        const service = new ExplicitFeatureFlagsService<TFeatureFlags>();
        service.setFlags(flags);
        return service;
      },
    };
  }

  setFlags(flags: Partial<Record<TFeatureFlags, boolean>>): void {
    this._flags = Object.assign({}, this._flags, flags);
  }

  isEnabled(flagIdentifier: TFeatureFlags): boolean {
    return this._flags[flagIdentifier] || false;
  }

  isEnabled$(flagIdentifier: TFeatureFlags): Observable<boolean> {
    return of(this.isEnabled(flagIdentifier));
  }
}
