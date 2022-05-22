import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { FeatureFlagOptions } from '../models';
import { FeatureFlagsService } from '../providers';

@Directive({
  selector: '[cosIfFeatureFlags]',
})
export class IfFeatureFlagsDirective implements OnDestroy {
  private hasView = false;

  @Input('cosIfFeatureFlags')
  set featureFlags(options: FeatureFlagOptions | undefined) {
    this.apply(this.checkFlags(options));
  }

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private _featureFlags: FeatureFlagsService
  ) {}

  ngOnDestroy() {
    this.hasView = false;
  }

  apply(condition: boolean) {
    if (condition) {
      if (!this.hasView)
        this._viewContainer.createEmbeddedView(this._templateRef);
      this.hasView = true;
    } else {
      this.hasView = false;
      this._viewContainer.clear();
    }
  }

  private isFlagEnabled(flagIdentifier: string): boolean {
    const negateFlag = flagIdentifier[0] === '!';
    if (negateFlag) {
      return !this._featureFlags.isEnabled(flagIdentifier.slice(1));
    }
    return this._featureFlags.isEnabled(flagIdentifier);
  }

  private checkFlags(options?: FeatureFlagOptions): boolean {
    const flags = options?.matches;
    if (typeof flags !== 'string' && !Array.isArray(flags)) {
      if (ngDevMode) {
        console.error(
          // tslint:disable-next-line: max-line-length
          'The `FeatureFlagsGuard` requires `featureFlags.matches` to be set to an array or string value in the `data` of your route configuration.'
        );
      }

      return false;
    }

    const featureFlags = new Array<string>().concat(flags);
    const hasAllFlagsOn = featureFlags.every((flag) =>
      this.isFlagEnabled(flag)
    );

    return hasAllFlagsOn;
  }
}
