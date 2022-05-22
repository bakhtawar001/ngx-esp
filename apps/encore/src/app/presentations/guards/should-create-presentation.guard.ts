import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first, map, mapTo, mergeMap } from 'rxjs/operators';

import { Project, SearchCriteria } from '@esp/models';
import { ProjectQueries } from '@esp/projects';
import {
  PresentationsSearchActions,
  PresentationsSearchQueries,
} from '@esp/presentations';

@Injectable({ providedIn: 'root' })
export class ShouldCreatePresentationGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly store: Store) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Step 1: let's wait for the project to be set since it's set asynchronously.
    const project$ = this.store
      .select(ProjectQueries.getProject)
      .pipe(first((project): project is Project => project !== null));

    // Step 2: let's search for presentations that are linked to that project.
    const search$ = project$.pipe(
      mergeMap((project) =>
        this.store
          .dispatch(
            new PresentationsSearchActions.Search(
              new SearchCriteria({
                filters: {
                  ProjectId: {
                    terms: [project.Id as number],
                  },
                },
              })
            )
          )
          .pipe(mapTo(project))
      )
    );

    return search$.pipe(
      map((project) => {
        // Step 3: if there's any presentation that is linked to that project then let's redirect
        // the user to that specific presentation.
        const presentations = this.store.selectSnapshot(
          PresentationsSearchQueries.getPresentations
        );

        if (presentations.length > 0) {
          return this.router.createUrlTree([
            `/projects/${project.Id}/presentations/${presentations[0].Id}`,
          ]);
        } else {
          return true;
        }
      })
    );
  }
}
