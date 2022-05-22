import { APP_BASE_HREF } from '@angular/common';
import {
  Component,
  Injectable,
  Injector,
  NgModule,
  NgZone,
  Type,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterModule,
} from '@angular/router';
import { Observable } from 'rxjs';

import { skipConsoleLogging } from '@cosmos/testing';

import { LocalState } from '../../../local-state';

export async function setupRouteDataFixture<T extends LocalState<T>>(options: {
  TestLocalState: Type<T>;
  initialRouteUrl?: string;
}) {
  const references: {
    route: ActivatedRoute;
    state: T;
    connectedObservable: Observable<T>;
  } = {
    route: null!,
    state: null!,
    connectedObservable: null!,
  };

  @Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
  })
  class TestAppRootComponent {}

  @Component({
    selector: 'app-test-first-page',
    template: '<h1>This is the first page!</h1>',
    providers: [options.TestLocalState],
  })
  class TestFirstPageComponent {
    constructor(route: ActivatedRoute, injector: Injector) {
      // Initialize the local state.
      const state = injector.get(options.TestLocalState);
      references.route = route;
      references.state = state;
      references.connectedObservable = state.connect(this);
    }
  }

  @Component({
    selector: 'app-test-second-page',
    template: '<h1>This is the second page!</h1>',
    providers: [options.TestLocalState],
  })
  class TestSecondPageComponent {
    constructor(route: ActivatedRoute, injector: Injector) {
      // Initialize the local state.
      const state = injector.get(options.TestLocalState);
      references.route = route;
      references.state = state;
      references.connectedObservable = state.connect(this);
    }
  }

  @Injectable({ providedIn: 'root' })
  class TestSecondPageResolver implements Resolve<string> {
    async resolve(snapshot: ActivatedRouteSnapshot) {
      return snapshot.params.id;
    }
  }

  @NgModule({
    imports: [
      BrowserModule,
      RouterModule.forRoot(
        [
          {
            path: 'first-page',
            component: TestFirstPageComponent,
          },
          {
            path: 'second-page/:id',
            component: TestSecondPageComponent,
            resolve: {
              id: TestSecondPageResolver,
            },
          },
        ],
        { initialNavigation: 'enabled' }
      ),
    ],
    declarations: [
      TestAppRootComponent,
      TestFirstPageComponent,
      TestSecondPageComponent,
    ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    bootstrap: [TestAppRootComponent],
  })
  class TestModule {}

  const ngModuleRef = await skipConsoleLogging(() =>
    platformBrowserDynamic().bootstrapModule(TestModule)
  );

  const router = ngModuleRef.injector.get(Router);
  const ngZone = ngModuleRef.injector.get(NgZone);

  await ngZone.run(() =>
    router.navigateByUrl(options.initialRouteUrl || '/first-page')
  );

  return {
    ngZone,
    router,
    references,
  };
}
