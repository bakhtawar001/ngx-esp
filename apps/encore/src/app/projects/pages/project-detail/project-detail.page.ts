import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import {
  AsiManageCollaboratorsModule,
  CollaboratorsDialogService,
} from '@asi/collaborators/ui/feature-core';
import { AsiCompanyAvatarModule } from '@asi/company/ui/feature-components';
import { InitialsPipe } from '@cosmos/common';
import { Avatar, CosAvatarListModule } from '@cosmos/components/avatar-list';
import { CosButtonModule } from '@cosmos/components/button';
import { CosPillModule } from '@cosmos/components/pill';
import { CosTrackerModule } from '@cosmos/components/tracker';
import {
  HasRolePipe,
  HasRolePipeModule,
  IsOwnerPipe,
  IsOwnerPipeModule,
} from '@esp/auth';
import { ProjectStepDisplayValue, ProjectStepName } from '@esp/models';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom } from 'rxjs';
import { CardMetadataListModule } from '../../../core/components/cards';
import { DetailHeaderComponentModule } from '../../../core/components/detail-header';
import { ProjectDetailNotificationsModule } from '../../components/project-detail-notifications';
import { ProjectInHandsDatePillModule } from '../../components/project-in-hands-date-pill';
import { ProjectTabsMenu } from '../../configs/tabs.config';
import { ProjectsDialogService } from '../../services';
import { ProjectDetailLoaderModule } from './project-detail.loader';
import { ProjectDetailLocalState } from './project-detail.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    ProjectDetailLocalState,
    {
      provide: PARTY_LOCAL_STATE,
      useExisting: ProjectDetailLocalState,
    },
  ],
})
export class ProjectDetailPage {
  tabs = ProjectTabsMenu;
  avatarList: Avatar[];

  canTransferOwnership!: boolean;

  readonly ProjectStepName = ProjectStepName;
  readonly ProjectStepDisplayValue = ProjectStepDisplayValue;

  constructor(
    public readonly state: ProjectDetailLocalState,
    private readonly collaboratorsDialogService: CollaboratorsDialogService,
    private readonly hasRolePipe: HasRolePipe,
    private readonly isOwnerPipe: IsOwnerPipe,
    private readonly projectDialog: ProjectsDialogService
  ) {
    this.state
      .connect(this)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.initCanTransferOwnership());

    const initials = new InitialsPipe();
    this.avatarList = this.state.project?.Collaborators?.map((c) => ({
      imgUrl: c.ImageUrl,
      toolTipText: c.Name,
      displayText: initials.transform(c.Name),
      icon: c.IsTeam ? 'fa-users' : '',
    }));
  }

  async onCloseProject(): Promise<void> {
    await firstValueFrom(this.projectDialog.openCloseProjectDialog()).then(
      (result) => {
        if (result) {
          this.state.closeProject({ ...result, Project: this.state.project });
        }
      }
    );
  }

  onReopenProject(): void {
    this.state.reopenProject(this.state.project);
  }

  async onTransferOwnership(): Promise<void> {
    await firstValueFrom(
      this.collaboratorsDialogService.openTransferOwnershipDialog({
        entity: this.state.project,
      })
    ).then((result) => {
      if (!!result && result.Id > 0) {
        this.state.transferOwnership(this.state.project, result.Id);
      }
    });
  }

  private initCanTransferOwnership(): void {
    this.canTransferOwnership =
      this.hasRolePipe.transform('Administrator') ||
      this.isOwnerPipe.transform(this.state?.project?.OwnerId);
  }
}

@NgModule({
  declarations: [ProjectDetailPage],
  imports: [
    CommonModule,
    RouterModule,

    MatTabsModule,
    MatMenuModule,

    ProjectDetailLoaderModule,
    DetailHeaderComponentModule,

    CosAvatarListModule,
    CosButtonModule,
    CosTrackerModule,
    CosPillModule,
    ProjectDetailNotificationsModule,
    AsiManageCollaboratorsModule,
    CardMetadataListModule,
    ProjectInHandsDatePillModule,
    AsiCompanyAvatarModule,
    HasRolePipeModule.withProvide(),
    IsOwnerPipeModule.withProvide(),
  ],
})
export class ProjectDetailPageModule {}
