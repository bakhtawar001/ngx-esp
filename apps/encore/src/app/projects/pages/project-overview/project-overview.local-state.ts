import { Injectable } from '@angular/core';
import { fromSelector, LocalState } from '@cosmos/state';
import { ProjectQueries } from '@esp/projects';

@Injectable()
export class ProjectOverviewLocalState extends LocalState<ProjectOverviewLocalState> {
  project = fromSelector(ProjectQueries.getProject);
}
