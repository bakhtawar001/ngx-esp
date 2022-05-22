import { Platform } from '@angular/cdk/platform';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { cloneDeep, isEqual, merge } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ICosmosConfig } from '../types';

export const COSMOS_CONFIG = new InjectionToken('COSMOS_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class CosmosConfigService {
  // Private
  private _configSubject!: BehaviorSubject<ICosmosConfig>;

  /**
   * Constructor
   *
   * @param _platform
   * @param _router
   * @param _config
   */
  constructor(
    private _platform: Platform,
    private _router: Router,
    @Inject(COSMOS_CONFIG) public readonly defaultConfig: ICosmosConfig
  ) {
    // Initialize the service
    this._init();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set and get the config
   */
  set config(value: ICosmosConfig) {
    /**
     * Disable custom scrollbars if browser is mobile
     */
    if (this._platform.ANDROID || this._platform.IOS) {
      value.customScrollbars = false;
    }

    this._configSubject.next(value);
  }

  get config(): ICosmosConfig {
    return this._configSubject.value;
  }

  get config$(): Observable<ICosmosConfig> {
    return this._configSubject.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Patch config
   */
  patchConfig(value: Partial<ICosmosConfig>) {
    /**
     * Disable custom scrollbars if browser is mobile
     */
    if (this._platform.ANDROID || this._platform.IOS) {
      value.customScrollbars = false;
    }

    const config = cloneDeep(this.defaultConfig);

    merge(config, value);

    this._configSubject.next(config);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Initialize
   *
   */
  private _init(): void {
    /**
     * Disable custom scrollbars if browser is mobile
     */
    if (this._platform.ANDROID || this._platform.IOS) {
      this.defaultConfig.customScrollbars = false;
    }

    // Set the config from the default config
    this._configSubject = new BehaviorSubject(cloneDeep(this.defaultConfig));

    // Reload the default config on every navigation start if
    // the current config is different from the default one
    this._router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        if (!isEqual(this._configSubject.value, this.defaultConfig)) {
          const config = cloneDeep(this.defaultConfig);

          this._configSubject.next(config);
        }
      });
  }
}
