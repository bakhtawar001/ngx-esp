import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  Renderer2,
  ɵɵdirectiveInject as inject,
} from '@angular/core';
import { CosmosConfigService, ICosmosConfig } from '@cosmos/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  COSMOS_NAVIGATION,
  NavigationItem,
  NavigationService,
} from '../../navigation';

@Directive()
export class AbstractLayoutComponent {
  // Private
  private _configService: CosmosConfigService;
  private _navigationService: NavigationService;
  private _platform: Platform;
  private _renderer: Renderer2;
  // private _splashScreenService: SplashScreenService;

  config$: Observable<ICosmosConfig>;
  document: Document;

  /**
   * Constructor
   *
   */
  constructor() {
    this._configService = inject(CosmosConfigService);
    this.document = inject(DOCUMENT);
    this._platform = inject(Platform);
    this._renderer = inject(Renderer2);
    this._navigationService = inject(NavigationService);
    // this._splashScreenService = inject(SplashScreenService);

    const navigation = <NavigationItem[]>inject(COSMOS_NAVIGATION);

    // Register the navigation to the service
    if (navigation) {
      this._navigationService.register('main', navigation);
      this._navigationService.setCurrentNavigation('main');
    }

    // Add is-mobile class to the body if the platform is mobile
    if (this._platform.ANDROID || this._platform.IOS) {
      this._renderer.addClass(document.body, 'is-mobile');
    }

    this.config$ = this._configService.config$.pipe(
      tap((config) => this._processConfig(config))
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private Methods
  // -----------------------------------------------------------------------------------------------------

  private _processConfig(config: ICosmosConfig) {
    if (config.layoutMode === 'boxed') {
      this._renderer.addClass(document.body, 'boxed');
    } else {
      this._renderer.removeClass(document.body, 'boxed');
    }

    // Color theme - Use normal for loop for IE11 compatibility
    for (let i = 0; i < this.document.body.classList.length; i++) {
      const className = this.document.body.classList[i];

      if (className.startsWith('theme-')) {
        this._renderer.removeClass(document.body, className);
      }
    }

    if (config.colorTheme) {
      this._renderer.addClass(document.body, config.colorTheme);
    }
    // this._renderer.addClass(document.body, 'theme-default');
  }
}
