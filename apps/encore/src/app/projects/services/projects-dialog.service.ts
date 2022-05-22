import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import { Project } from '@esp/models';
import { projectEditInfoDialogDef } from '../dialogs/project-edit-info';
import { Observable } from 'rxjs';
import { ProjectCloseDialogResult } from '../dialogs/project-close/models/dialog.model';
import { projectCloseDialogDef } from '../dialogs/project-close/project-close.config';

@Injectable({
  providedIn: 'root',
})
export class ProjectsDialogService {
  constructor(private readonly dialog: DialogService) {}

  openProjectEditInfoDialog(data: Project) {
    return this.dialog.open(projectEditInfoDialogDef, data);
  }

  openCloseProjectDialog(): Observable<ProjectCloseDialogResult> {
    return this.dialog.open(projectCloseDialogDef);
  }
}
