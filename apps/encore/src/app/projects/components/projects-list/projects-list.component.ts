import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { AsiEmptyStateInfoModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { trackItem } from '@cosmos/core';
import { BaseProject } from '@esp/models';
import { ProjectSearch } from '@esp/projects';
import { EspSearchPaginationModule } from '@esp/search';
import { firstValueFrom } from 'rxjs';
import {
  PROJECT_SEARCH_LOCAL_STATE,
  ProjectSearchLocalState,
} from '../../local-states';
import { ProjectsDialogService } from '../../services';
import {
  ProjectDetailsCardLoaderModule,
  ProjectDetailsCardModule,
} from '../project-details-card';
import { ProjectsListNoProjectsDirective } from './projects-list-no-projects.directive';
import { ProjectsListNoSearchResultsDirective } from './projects-list-no-search-results.directive';

@Component({
  selector: 'esp-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectsListComponent {
  readonly trackProject = trackItem<BaseProject>(['Id']);

  constructor(
    private readonly collaboratorsDialogService: CollaboratorsDialogService,
    private readonly projectsDialogService: ProjectsDialogService,
    @Inject(PROJECT_SEARCH_LOCAL_STATE)
    public readonly state: ProjectSearchLocalState
  ) {
    this.state.connect(this);
  }

  // @TODO move usages of services here to project-crud.service
  async onCloseProject(project: ProjectSearch): Promise<void> {
    await firstValueFrom(
      this.projectsDialogService.openCloseProjectDialog()
    ).then((result) => {
      if (result) {
        this.state.closeProject({ ...result, Project: project });
      }
    });
  }

  onReopenProject(project: ProjectSearch): void {
    this.state.reopenProject(project);
  }

  onToggleProjectDetails(project: ProjectSearch): void {
    this.state.markAsRecent(project);
  }

  // @TODO move usages of services here to project-crud.service
  async onTransferOwnership(project: ProjectSearch): Promise<void> {
    await firstValueFrom(
      this.collaboratorsDialogService.openTransferOwnershipDialog({
        entity: project,
      })
    ).then((result) => {
      if (!!result && result.Id > 0) {
        this.state.transferOwnership(project, result.Id);
      }
    });
  }
}

@NgModule({
  declarations: [
    ProjectsListComponent,
    ProjectsListNoProjectsDirective,
    ProjectsListNoSearchResultsDirective,
  ],
  exports: [
    ProjectsListComponent,
    ProjectsListNoProjectsDirective,
    ProjectsListNoSearchResultsDirective,
  ],
  imports: [
    CommonModule,
    ProjectDetailsCardLoaderModule,
    EspSearchPaginationModule,
    ProjectDetailsCardModule,
    AsiEmptyStateInfoModule,
    CosButtonModule,
  ],
})
export class ProjectsListModule {}
