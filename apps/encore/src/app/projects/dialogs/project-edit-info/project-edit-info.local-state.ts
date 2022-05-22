import { Injectable } from '@angular/core';
import { asDispatch, LocalState } from '@cosmos/state';
import { ProjectActions } from '@esp/projects';

@Injectable()
export class ProjectEditInfoLocalState extends LocalState<ProjectEditInfoLocalState> {
  update = asDispatch(ProjectActions.Update);
}
