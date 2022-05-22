import { APP_BASE_HREF, Location } from '@angular/common';
import {
  Component,
  ErrorHandler,
  Injectable,
  Injector,
  NgModule,
  NgZone,
  Type,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CanActivate, Router, RouterModule } from '@angular/router';
import {
  createPromiseTestHelper,
  skipConsoleLogging,
  TestRecorder,
} from '@cosmos/testing';
import { Observable } from 'rxjs';
import { LocalState } from '../../../local-state';

export async function setupUrlQueryParameterFixture<
  T extends LocalState<T>
>(options: {
  TestLocalState: Type<T>;
  initialRouteUrl?: string;
  errorHandler?: ErrorHandler;
  redirectGuardTargetUrl?: string[];
}) {
  const {
    promise: componentStateReady,
    markPromiseResolved: markComponentStateReady,
  } = createPromiseTestHelper();

  let references!: {
    component: TestComponent;
    connectedObservable: Observable<T>;
    state: T;
  };

  const componentNotifyZoneRecorder = new TestRecorder<string>();

  @Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
    providers: [],
  })
  class TestAppRootComponent {}

  @Component({
    selector: 'app-page',
    template: `
      <h1>This is the page with local state!</h1>
      <router-outlet></router-outlet>
    `,
    providers: [options.TestLocalState],
  })
  class TestComponent {
    constructor(injector: Injector) {
      // Initialize the local state.
      const state = injector.get(options.TestLocalState);
      const connectedObservable = state.connect(this);
      connectedObservable.subscribe(() => {
        componentNotifyZoneRecorder.record(
          NgZone.isInAngularZone() ? 'InAngularZone' : 'OutsideAngularZone'
        );
        markComponentStateReady();
      });
      references = {
        component: this,
        state,
        connectedObservable,
      };
    }
  }

  @Component({
    selector: 'app-child-page',
    template: '<h2>This is a child page!</h2>',
    providers: [],
  })
  class TestChildPageComponent {}

  @Component({
    selector: 'app-other-page',
    template: '<h1>This is the other page!</h1>',
    providers: [],
  })
  class TestOtherPageComponent {}

  const {
    promise: guardPromise,
    markPromiseResolved: resolveGuardPromise,
  } = createPromiseTestHelper<boolean>();

  @Injectable({ providedIn: 'root' })
  class PageGuard implements CanActivate {
    canActivate() {
      return guardPromise;
    }
  }

  @Injectable({ providedIn: 'root' })
  class ErrorGuard implements CanActivate {
    canActivate(): boolean {
      throw new Error('Error from guard');
    }
  }

  @Injectable({ providedIn: 'root' })
  class PageGuardWithRedirect implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
      return this.router.createUrlTree(
        options.redirectGuardTargetUrl || ['/other-page']
      );
    }
  }

  // @Injectable({ providedIn: 'root' })
  // class PageResolver implements Resolve<void> {
  //   resolve() {}
  // }

  @Component({
    selector: 'app-guarded-page',
    template: '',
  })
  class GuardedTestComponent {}

  @Component({
    selector: 'app-guarded-page-with-redirect',
    template: '',
  })
  class GuardedTestWithRedirectComponent {}

  @NgModule({
    imports: [
      BrowserModule,
      RouterModule.forRoot(
        [
          {
            path: 'page',
            component: TestComponent,
            children: [
              {
                path: 'child-page',
                component: TestChildPageComponent,
              },
              {
                path: 'guarded-child-page',
                component: GuardedTestComponent,
                canActivate: [PageGuard],
              },
              {
                path: 'guarded-child-error',
                component: GuardedTestComponent,
                canActivate: [ErrorGuard],
              },
            ],
          },
          {
            path: 'other-page',
            pathMatch: 'full',
            component: TestOtherPageComponent,
          },
          {
            path: 'guarded-page',
            pathMatch: 'full',
            component: GuardedTestComponent,
            canActivate: [PageGuard],
          },
          {
            path: 'guarded-page-error',
            pathMatch: 'full',
            component: GuardedTestComponent,
            canActivate: [ErrorGuard],
          },
          {
            path: 'guarded-page-with-redirect',
            pathMatch: 'full',
            component: GuardedTestWithRedirectComponent,
            canActivate: [PageGuardWithRedirect],
          },
        ],
        {
          initialNavigation: 'enabledBlocking',
        }
      ),
    ],
    declarations: [
      TestAppRootComponent,
      TestComponent,
      GuardedTestComponent,
      GuardedTestWithRedirectComponent,
    ],
    bootstrap: [TestAppRootComponent],
    providers: [
      { provide: APP_BASE_HREF, useValue: '/' },
      options.errorHandler
        ? { provide: ErrorHandler, useValue: options.errorHandler }
        : [],
    ],
  })
  class TestModule {}

  const ngModuleRef = await skipConsoleLogging(() =>
    platformBrowserDynamic().bootstrapModule(TestModule)
  );
  const ngZone = ngModuleRef.injector.get(NgZone);
  const router = ngModuleRef.injector.get(Router);
  const location = ngModuleRef.injector.get(Location);

  const everythingReady = new Promise<void>(async (resolve) => {
    await componentStateReady;
    resolve();
  });

  await ngZone.run(() =>
    router.navigateByUrl(options.initialRouteUrl || '/page')
  );
  return {
    ngZone,
    router,
    location,
    state: references.state,
    component: references.component as any,
    componentStateReady,
    componentNotifyZoneRecorder,
    everythingReady,
    resolveGuardPromise,
  };
}
