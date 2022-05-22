import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AsiCompanyAvatarModule } from '@asi/company/ui/feature-components';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosContextIconModule } from '@cosmos/components/context-icon';
import { CosPillModule } from '@cosmos/components/pill';
import { CosTrackerModule } from '@cosmos/components/tracker';
import { ProjectSearch } from '@esp/projects';
import { ProjectStepDisplayValue, ProjectStepName } from '@esp/models';
import { CardMetadataListModule } from '../../../core/components/cards';
import { DetailHeaderComponentModule } from '../../../core/components/detail-header';
import { ProjectDetailNotificationsModule } from '../project-detail-notifications';
import { ProjectInHandsDatePillModule } from '../project-in-hands-date-pill';

@Component({
  selector: 'esp-project-details-card',
  templateUrl: './project-details-card.component.html',
  styleUrls: ['./project-details-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDetailsCardComponent {
  @Input()
  project!: ProjectSearch;

  @Output()
  closeProject = new EventEmitter<void>();
  @Output()
  reopenProject = new EventEmitter<void>();
  @Output()
  toggleProjectDetails = new EventEmitter<void>();
  @Output()
  transferOwnership = new EventEmitter<ProjectSearch>();

  detailShown = false;

  readonly defaultColor = '#6A7281';
  readonly ProjectStepName = ProjectStepName;
  readonly ProjectStepDisplayValue = ProjectStepDisplayValue;

  onTransferOwnership(): void {
    this.transferOwnership.emit(this.project);
  }

  onCloseProject(): void {
    this.closeProject.emit();
  }

  onReopenProject(): void {
    this.reopenProject.emit();
  }

  onToggleDetail(): void {
    this.detailShown = !this.detailShown;
    this.toggleProjectDetails.emit();
  }
}

@NgModule({
  declarations: [ProjectDetailsCardComponent],
  imports: [
    CommonModule,
    CosCardModule,
    CosButtonModule,
    CosPillModule,
    CosAvatarModule,
    CosTrackerModule,
    CosContextIconModule,
    MatMenuModule,
    RouterModule,
    CardMetadataListModule,
    DetailHeaderComponentModule,
    ProjectDetailNotificationsModule,
    ProjectInHandsDatePillModule,
    AsiCompanyAvatarModule,
    InitialsPipeModule,
  ],
  exports: [ProjectDetailsCardComponent],
})
export class ProjectDetailsCardModule {}
