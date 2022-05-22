import {
  Inject,
  Injectable,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { loadScript } from '../utils';

export interface HotJarConfig {
  appId: string;
  enabled?: boolean;
  options?: any;
}

export interface HjFn extends Function {
  (...args: Array<any>): void;
  q: Array<any>;
}

export const HOTJAR_SERVICE_CONFIG = new InjectionToken<HotJarConfig>('hotjar');

const hotjar = window.hj || [];

declare global {
  interface Window {
    hj: any;
  }
}

@Injectable()
export class HotJarService {
  private hotjar: any;

  private scriptHasBeenLoaded$ = new ReplaySubject<boolean>(1);

  constructor(
    // private ngZone: NgZone,
    // private router: Router,
    @Inject(HOTJAR_SERVICE_CONFIG) private config: HotJarConfig
  ) {
    if (config.enabled) {
      this.initialize();

      // DO WE NEED THIS? seems to record fine without it...
      // this.router.events
      //   .pipe(filter((event) => event instanceof NavigationEnd))
      //   .subscribe((event: NavigationEnd) => {
      //     this.ngZone.runOutsideAngular(() => {
      //       window.hj('stateChange', event.urlAfterRedirects);
      //     });
      //   });
    }
  }

  private initialize(): void {
    hotjar.load = loadHotJar;

    // window.Appcues = appcues;
    this.hotjar = hotjar;

    hotjar.load(this.config.appId, this.scriptHasBeenLoaded$);
  }
}

function loadHotJar(
  appId: string,
  scriptHasBeenLoaded$: ReplaySubject<boolean>
) {
  (function (
    h: Window & { hj?: HjFn; _hjSettings?: { hjid: string; hjsv: number } },
    o,
    t,
    j,
    a,
    r
  ) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: appId, hjsv: 6 };
    loadScript({
      src: t + h._hjSettings.hjid + j + h._hjSettings.hjsv,
      onLoad: () => {
        scriptHasBeenLoaded$.next(h.hj.globals);
        scriptHasBeenLoaded$.complete();
      },
    });
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
}

@NgModule()
export class HotJarModule {
  constructor(HotJar: HotJarService) {}

  static forRoot(config: HotJarConfig): ModuleWithProviders<HotJarModule> {
    return {
      ngModule: HotJarModule,
      providers: [
        HotJarService,
        {
          provide: HOTJAR_SERVICE_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
