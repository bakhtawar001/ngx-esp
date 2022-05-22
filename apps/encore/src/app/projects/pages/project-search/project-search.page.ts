import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AsiEmptyStateInfoModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import {
  EspSearchPaginationModule,
  EspSearchSortModule,
  EspSearchTabsModule,
  SEARCH_LOCAL_STATE,
} from '@esp/search';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AddToOrderFlow } from '../../../orders/flows';
import {
  ProjectDetailsCardLoaderModule,
  ProjectDetailsCardModule,
} from '../../components/project-details-card';
import { ProjectSearchHeaderModule } from '../../components/project-search-header';
import { ProjectsListModule } from '../../components/projects-list';
import { sortOptions } from '../../configs';
import { CreatePresentationFlow } from '../../flows';
import {
  PROJECT_SEARCH_LOCAL_STATE,
  ProjectSearchLocalState,
} from '../../local-states';
import { ProjectSearchPageLocalState } from './project-search-page.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-project-search',
  templateUrl: './project-search.page.html',
  styleUrls: ['./project-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    AddToOrderFlow,
    CreatePresentationFlow,
    ProjectSearchPageLocalState,
    {
      provide: PROJECT_SEARCH_LOCAL_STATE,
      useExisting: ProjectSearchPageLocalState,
    },
    {
      provide: SEARCH_LOCAL_STATE,
      useExisting: ProjectSearchPageLocalState,
    },
  ],
})
export class ProjectSearchPage {
  readonly sortOptions = sortOptions;

  constructor(
    private readonly addToOrderFlow: AddToOrderFlow,
    private readonly createPresentationFlow: CreatePresentationFlow,
    @Inject(PROJECT_SEARCH_LOCAL_STATE)
    public readonly state: ProjectSearchLocalState
  ) {
    this.state.connect(this);
  }

  onCreateOrder(): void {
    this.addToOrderFlow.start();
  }

  onCreatePresentation(): void {
    this.createPresentationFlow.start();
  }
}

@NgModule({
  declarations: [ProjectSearchPage],
  imports: [
    CommonModule,
    CosButtonModule,
    EspSearchPaginationModule,
    EspSearchTabsModule,
    MatDialogModule,
    ProjectSearchHeaderModule,
    ProjectDetailsCardLoaderModule,
    ProjectDetailsCardModule,
    EspSearchSortModule,
    ProjectsListModule,
    AsiEmptyStateInfoModule,
  ],
})
export class ProjectSearchPageModule {}
