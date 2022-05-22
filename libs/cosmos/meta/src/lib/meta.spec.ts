import { Component, NgModule, NgModuleRef, NgZone, Type } from '@angular/core';
import { APP_BASE_HREF, Location } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { Actions, NgxsModule, ofActionDispatched, Store } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  skipConsoleLogging,
  freshPlatform,
  waitForNavigationToComplete,
} from '@cosmos/testing';

import { MetaModule } from './meta.module';
import { SetTitle } from './meta.actions';

describe('Meta', () => {
  class TitleRecorder {
    titles: readonly string[] = [];

    constructor(private ngModuleRef: NgModuleRef<unknown>) {}

    start(): void {
      const subscription = this.ngModuleRef.injector
        .get(Router)
        .events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.record();
          }
        });

      this.ngModuleRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }

    private record(): void {
      const title = this.ngModuleRef.injector.get(Title).getTitle();
      const ogTitle = this.ngModuleRef.injector
        .get(Meta)
        .getTag('property="og:title"');
      // The `<meta property="og:title" ..>` should exist and should equal `document.title`.
      if (ogTitle === null || title !== ogTitle.content) {
        throw new Error(
          'record(): og:title is missing or does not equal `document.title`.'
        );
      }
      this.titles = [...this.titles, title];
    }
  }

  async function setup(options: {
    routes: Routes;
    declarations?: Type<unknown>[];
  }) {
    @Component({
      selector: 'app-root',
      template: '<router-outlet></router-outlet>',
    })
    class TestAppRootComponent {}

    @NgModule({
      imports: [
        BrowserModule,
        RouterModule.forRoot(options.routes, {
          initialNavigation: 'enabledBlocking',
        }),
        NgxsModule.forRoot([], { developmentMode: true }),
        MetaModule.forRoot({
          applicationName: 'Encore',
          pageTitleSeparator: ' - ',
          defaults: {
            title: 'Encore',
          },
        }),
      ],
      declarations: [TestAppRootComponent, options.declarations || []],
      bootstrap: [TestAppRootComponent],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    })
    class TestModule {}

    const ngModuleRef = await skipConsoleLogging(() =>
      platformBrowserDynamic().bootstrapModule(TestModule)
    );

    const store = ngModuleRef.injector.get(Store);
    const ngZone = ngModuleRef.injector.get(NgZone);
    const router = ngModuleRef.injector.get(Router);
    const actions$ = ngModuleRef.injector.get(Actions);
    const recorder = new TitleRecorder(ngModuleRef);
    recorder.start();

    return {
      store,
      ngZone,
      router,
      actions$,
      recorder,
      ngModuleRef,
    };
  }

  it(
    'should set the title tag when navigating to pages',
    freshPlatform(async () => {
      // Arrange
      @Component({
        selector: 'app-page',
        template: '',
      })
      class TestComponent {}

      const routes = [
        {
          path: 'collections',
          component: TestComponent,
          data: {
            meta: {
              title: 'Collections',
            },
          },
        },
        {
          path: 'suppliers',
          component: TestComponent,
          data: {
            meta: {
              title: 'Suppliers',
            },
          },
        },
      ];

      const { ngZone, router, recorder } = await setup({
        routes,
        declarations: [TestComponent],
      });

      // Act
      await ngZone.run(() => router.navigateByUrl('/collections'));
      await ngZone.run(() => router.navigateByUrl('/suppliers'));

      // Assert
      expect(recorder.titles).toEqual([
        'Collections - Encore',
        'Suppliers - Encore',
      ]);
    })
  );

  it(
    'should set the title when navigating to a lazy loaded module',
    freshPlatform(async () => {
      // Arrange
      @Component({
        selector: 'app-page',
        template: '',
      })
      class TestComponent {}

      @NgModule({
        imports: [
          RouterModule.forChild([{ path: '', component: TestComponent }]),
        ],
        declarations: [TestComponent],
      })
      class TestModule {}

      const routes: Routes = [
        {
          path: 'collections',
          loadChildren: () => TestModule,
          data: {
            meta: {
              title: 'Collections',
            },
          },
        },
      ];

      const { ngZone, router, recorder } = await setup({
        routes,
      });

      // Act
      await ngZone.run(() => router.navigateByUrl('/collections'));

      // Assert
      expect(recorder.titles).toEqual(['Collections - Encore']);
    })
  );

  it(
    'should set the title when the `SetTitle` action is dispatched',
    freshPlatform(async () => {
      // Arrange
      @Component({
        selector: 'app-page',
        template: '',
      })
      class TestComponent {
        constructor(store: Store) {
          store.dispatch(new SetTitle('Some collection - Collections'));
        }
      }

      const routes: Routes = [
        {
          path: 'collections',
          component: TestComponent,
          data: {
            meta: {
              title: 'Collections',
            },
          },
        },
      ];

      const { ngZone, router, actions$, recorder } = await setup({
        routes,
        declarations: [TestComponent],
      });

      // Act
      await Promise.all([
        firstValueFrom(actions$.pipe(ofActionDispatched(SetTitle), take(1))),
        ngZone.run(() => router.navigateByUrl('/collections')),
      ]);

      // Assert
      expect(recorder.titles).toEqual(['Some collection - Collections']);
    })
  );

  it(
    'should set the title for child routes and when navigating back',
    freshPlatform(async () => {
      // Arrange
      @Component({
        selector: 'app-page',
        template: '<router-outlet></router-outlet>',
      })
      class TestComponent {}

      @Component({
        selector: 'app-user',
        template: '',
      })
      class UserComponent {}

      @Component({
        selector: 'app-users',
        template: '',
      })
      class UsersComponent {}

      const routes: Routes = [
        {
          path: '',
          component: TestComponent,
          children: [
            {
              path: 'user',
              component: UserComponent,
              data: {
                meta: {
                  title: 'User',
                },
              },
            },
            {
              path: 'users',
              component: UsersComponent,
              data: {
                meta: {
                  title: 'Users',
                },
              },
            },
          ],
        },
      ];

      const { ngZone, router, ngModuleRef, recorder } = await setup({
        routes,
        declarations: [TestComponent, UserComponent, UsersComponent],
      });

      // Act
      await ngZone.run(() => router.navigateByUrl('/user'));
      await ngZone.run(() => router.navigateByUrl('/users'));

      const location = ngModuleRef.injector.get(Location);
      location.back();
      await waitForNavigationToComplete(router);

      // Assert
      expect(recorder.titles).toEqual([
        'User - Encore',
        'Users - Encore',
        'User - Encore',
      ]);
    })
  );
});
