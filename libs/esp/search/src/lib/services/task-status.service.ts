import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import { TaskStatusResponse } from '@esp/service-configs';
import { forkJoin, Observable, of, timer } from 'rxjs';
import { first, map, mergeMapTo } from 'rxjs/operators';

export const ALGOLIA_TASKS_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'Algolia Tasks Service Configuration',
  {
    providedIn: 'root',
    factory: () =>
      new ServiceConfig({
        Url: 'https://asiservice.asicentral.com/babou/api/zeal',
      }),
  }
);

@Injectable({
  providedIn: 'root',
})
export class AlgoliaTasksService {
  pollingPeriod = 500;

  constructor(
    @Inject(ALGOLIA_TASKS_SERVICE_CONFIG)
    protected readonly config: ServiceConfig,
    protected readonly http: HttpClient
  ) {}

  getTaskStatus(indexName: string, taskId: number) {
    const params = new HttpParams()
      .append('indexName', indexName)
      .append('taskId', taskId);

    return this.http.get<TaskStatusResponse>(
      `${this.config.Url}/algolia/taskstatus`,
      { params }
    );
  }

  waitUntilAllTasksArePublished(
    response: HttpResponse<Object>
  ): Observable<Record<string, TaskStatusResponse>[]> {
    // E.g. {​​​​​​ ​"uat_collection": [2531005001], "uat_collectionproduct": [2531006001] }​​​​​​​​
    const allTaskIds: Record<string, number[]> | null = JSON.parse(
      // The browser will not allow to parse the `algoliataskids` header per each request,
      // since it respects the `access-control-expose-headers` header.
      // The `JSON.parse` will return `null` if the provided argument is `null`.
      response.headers.get('algoliataskids') || null
    );

    if (allTaskIds === null || Object.keys(allTaskIds).length === 0) {
      // Don't return `EMPTY` here, we have to emit any value just to allow the `CollectionsState` action handlers
      // to proceed with their flow if there're no Algolia task IDs.
      return of([]);
    } else {
      return this.getPollingRequests(allTaskIds);
    }
  }

  private getPollingRequests(allTaskIds: Record<string, number[]>) {
    const requests: Observable<Record<string, TaskStatusResponse>>[] = [];

    // The `indexName` is an Algolia index, for instance, `uat_collection`.
    for (const [indexName, taskIds] of Object.entries(allTaskIds)) {
      // Caretaker note: I've used 2 nested for-loops just for readability purposes, it becomes a bit
      // messy and complicated to read with `Object.entries().map(...)`, etc.
      for (const taskId of taskIds) {
        const source$ = this.getTaskStatus(indexName, taskId);
        // We could've used the `timer + switchMap -> forkJoin` but we don't want to make duplicate requests, since "fork-joining"
        // observables will cancel all previous HTTP requests and will fire new requests.
        const request$ = timer(0, this.pollingPeriod).pipe(
          // We could've used the `switchMapTo` here but it has some issues.
          // E.g. if the server doesn't respond in 500 ms then the `timer()` will keep cancelling requests
          // and it'll never end, we'll end up in an infinite loop.
          mergeMapTo(source$),
          first((response) => this.taskIsPublished(response)),
          map((response) => ({ [indexName]: response }))
        );
        requests.push(request$);
      }
    }

    return forkJoin(requests);
  }

  private taskIsPublished(response: TaskStatusResponse) {
    return response.PendingTask === false && response.Status === 'published';
  }
}
