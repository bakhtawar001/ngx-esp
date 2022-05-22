import { Injectable } from '@angular/core';
import {
  ProjectActions,
  ProjectQueries,
  ProjectsRecentActions,
} from '@esp/projects';
import { asDispatch, fromSelector } from '@cosmos/state';
import { Project } from '@esp/models';
import { PartyLocalState } from '@esp/parties';

@Injectable()
export class ProjectDetailLocalState extends PartyLocalState<ProjectDetailLocalState> {
  project = fromSelector(ProjectQueries.getProject);
  private _patchProject = asDispatch(ProjectActions.Patch);

  hasLoaded = fromSelector(ProjectQueries.hasLoaded);
  isLoading = fromSelector(ProjectQueries.isLoading);
  canEdit = fromSelector(ProjectQueries.canEdit);

  closeProject = asDispatch(ProjectActions.CloseProject);
  reopenProject = asDispatch(ProjectActions.ReopenProject);
  transferOwnership = asDispatch(ProjectActions.TransferOwner);

  updateRecents = asDispatch(ProjectsRecentActions.Load);

  get partyIsReady(): boolean {
    return !this.isLoading && this.hasLoaded;
  }

  save(party: Partial<Project>): void {
    this._patchProject(party);
  }

  get party(): Project {
    return this.project;
  }
}
