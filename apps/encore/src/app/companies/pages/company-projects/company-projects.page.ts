import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { AsiEmptyStateInfoModule } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import { AuthGuard } from '@esp/auth';
import {
  EspSearchSortModule,
  EspSearchTabsModule,
  SEARCH_LOCAL_STATE,
} from '@esp/search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { AddToOrderFlow } from '../../../orders/flows';
import { ProjectSearchHeaderModule } from '../../../projects/components/project-search-header';
import { ProjectsListModule } from '../../../projects/components/projects-list';
import { CreatePresentationFlow } from '../../../projects/flows';
import { PROJECT_SEARCH_LOCAL_STATE } from '../../../projects/local-states';
import { CompanyProjectsFiltersCacheService } from './company-projects-filters-cache.service';
import { CompanyProjectsPageLocalState } from './company-projects-page.local-state';
import { CompanyProjectsResolver } from './company-projects.resolver';
import { sortOptions } from './configs';

@UntilDestroy()
@Component({
  selector: 'esp-company-projects',
  templateUrl: './company-projects.page.html',
  styleUrls: ['./company-projects.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    AddToOrderFlow,
    CreatePresentationFlow,
    CompanyProjectsPageLocalState,
    {
      provide: PROJECT_SEARCH_LOCAL_STATE,
      useExisting: CompanyProjectsPageLocalState,
    },
    {
      provide: SEARCH_LOCAL_STATE,
      useExisting: CompanyProjectsPageLocalState,
    },
  ],
})
export class CompanyProjectsPage implements OnInit {
  readonly sortOptions = sortOptions;

  constructor(
    private readonly createOrderFlow: AddToOrderFlow,
    private readonly createPresentationFlow: CreatePresentationFlow,
    private readonly filtersCacheService: CompanyProjectsFiltersCacheService,
    private readonly router: Router,
    public readonly state: CompanyProjectsPageLocalState
  ) {
    this.state.connect(this);
  }

  ngOnInit(): void {
    this.listenToNavigateOutsideDirectory();
  }

  onCreateOrder(): void {
    this.createOrderFlow.start();
  }

  onCreatePresentation(): void {
    this.createPresentationFlow.start();
  }

  private listenToNavigateOutsideDirectory(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        filter((navigationStart: NavigationStart) =>
          this.filtersCacheService.checkIfShouldClear(navigationStart)
        ),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.filtersCacheService.clear();
      });
  }
}

@NgModule({
  declarations: [CompanyProjectsPage],
  exports: [RouterModule],
  imports: [
    CommonModule,
    AsiEmptyStateInfoModule,
    CosButtonModule,
    ProjectsListModule,
    RouterModule.forChild([
      {
        path: '',
        component: CompanyProjectsPage,
        resolve: [CompanyProjectsResolver],
        canActivate: [AuthGuard],
      },
    ]),
    EspSearchTabsModule,
    EspSearchSortModule,
    ProjectSearchHeaderModule,
  ],
  providers: [CompanyProjectsFiltersCacheService, CompanyProjectsResolver],
})
export class CompanyProjectsPageModule {}
