import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import { SearchCriteria } from '@esp/models';
import { ProjectsRecentActions, ProjectsRecentQueries } from '@esp/projects';

@Injectable()
export class ProjectsMenuLocalState extends LocalState<ProjectsMenuLocalState> {
  static readonly maxProjectsCount = 5;
  static readonly projectsStatus = 'Active';

  criteria = fromSelector(ProjectsRecentQueries.getCriteria);
  hasLoaded = fromSelector(ProjectsRecentQueries.hasLoaded);
  isLoading = fromSelector(ProjectsRecentQueries.isLoading);
  projects = fromSelector(ProjectsRecentQueries.getRecents);
  size = ProjectsMenuLocalState.maxProjectsCount;

  private _search = asDispatch(ProjectsRecentActions.Search);

  search({
    term,
    size = ProjectsMenuLocalState.maxProjectsCount,
    status = ProjectsMenuLocalState.projectsStatus,
  }: Partial<SearchCriteria>): void {
    this._search({ term, size, status, from: 1 });
  }
}
