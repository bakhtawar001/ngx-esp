import { FactoryProvider, INJECTOR, Injector, Type } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { AlgoliaTasksService } from '../services';

// Patterns that might be matched:
// vulcan/projects
// zeal/collections

export class AlgoliaTasksInterceptor implements HttpInterceptor {
  static create({
    urlPattern,
    actionToDispatch,
  }: {
    urlPattern: RegExp;
    actionToDispatch: Type<unknown>;
  }): FactoryProvider {
    return {
      provide: HTTP_INTERCEPTORS,
      useFactory: (injector: Injector) =>
        new AlgoliaTasksInterceptor(injector, urlPattern, actionToDispatch),
      multi: true,
      deps: [INJECTOR],
    };
  }

  private readonly store: Store;
  private readonly algoliaTasksService: AlgoliaTasksService;

  constructor(
    injector: Injector,
    private readonly urlPattern: RegExp,
    private readonly actionToDispatch: Type<unknown>
  ) {
    this.store = injector.get(Store);
    this.algoliaTasksService = injector.get(AlgoliaTasksService);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const event$ = next.handle(req);

    if (this.shouldIgnoreUrl(req.url)) {
      return event$;
    }

    return event$.pipe(
      tap((event) => {
        if (event instanceof HttpResponse && this.canIntercept(event)) {
          this.algoliaTasksService
            .waitUntilAllTasksArePublished(event)
            .pipe(filter((tasks) => !!tasks?.length))
            .subscribe(() => {
              this.store.dispatch(new this.actionToDispatch(event.body));
            });
        }
      })
    );
  }

  private canIntercept(response: HttpResponse<any>): boolean {
    return response.headers.has('algoliataskids');
  }

  private shouldIgnoreUrl(url: string): boolean {
    return url.match(this.urlPattern) === null;
  }
}
