import { Injectable } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RemoveFilterPayload } from '@asi/ui/feature-filters';
import { asDispatch, fromSelector, urlQueryParameter } from '@cosmos/state';
import {
  ProjectActions,
  ProjectSearch,
  ProjectSearchActions,
  ProjectSearchFilters,
  ProjectsSearchQueries,
  SearchCriteria,
} from '@esp/projects';
import { SearchLocalState, TabFilter } from '@esp/search';
import { ProjectSearchLocalState } from '../../../projects/local-states';
import { mapSearchCriteriaToProjectSearchFilters } from '../../../projects/utils/filter-params-mapper.util';
import { syncProjectsSetting } from '../../../projects/utils/sync-project-setting.state-prop';
import { CompanyProjectsFiltersCacheService } from './company-projects-filters-cache.service';
import { sortOptions, tabs } from './configs';

// @TODO WJ think about simplifying it, to not duplicate filters logic
@Injectable()
export class CompanyProjectsPageLocalState
  extends SearchLocalState<CompanyProjectsPageLocalState>
  implements ProjectSearchLocalState
{
  override criteria = fromSelector(ProjectsSearchQueries.getCriteria);
  override filters = urlQueryParameter<ProjectSearchFilters>('filters', {
    defaultValue: {},
    debounceTime: 100,
    converter: this.filtersCacheService.filtersConverter,
  });
  override from = urlQueryParameter<number>('page', {
    defaultValue: 1,
    debounceTime: 0,
    converter: this.filtersCacheService.fromConverter,
  });
  override term = urlQueryParameter<string>('q', {
    defaultValue: '',
    debounceTime: 0,
    converter: this.filtersCacheService.termConverter,
  });
  override get tab(): TabFilter {
    return tabs[this.tabIndex];
  }
  override tabIndex = syncProjectsSetting('searchTabIndex', 0);
  override total = fromSelector(ProjectsSearchQueries.getTotal);
  override sort = syncProjectsSetting('projectSort', sortOptions[0]);

  isLoading = fromSelector(ProjectsSearchQueries.isLoading);
  hasLoaded = fromSelector(ProjectsSearchQueries.hasLoaded);
  projects = fromSelector(ProjectsSearchQueries.getProjects);
  filterPills = fromSelector(ProjectsSearchQueries.getFilterPills);
  closeProject = asDispatch(ProjectSearchActions.CloseProject);
  reopenProject = asDispatch(ProjectSearchActions.ReopenProject);
  transferOwnership = asDispatch(ProjectSearchActions.TransferOwner);
  facets = fromSelector(ProjectsSearchQueries.getFacets);
  ownerFacets = fromSelector(ProjectsSearchQueries.getOwnerFacets);
  stepNameFacets = fromSelector(ProjectsSearchQueries.getStepNameFacets);

  private readonly _loadProject = asDispatch(ProjectActions.Get);
  private readonly _search = asDispatch(ProjectSearchActions.Search);

  readonly tabs = tabs;

  constructor(
    private readonly filtersCacheService: CompanyProjectsFiltersCacheService
  ) {
    super();
  }

  override setTab(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
    this.from = 1;
  }

  override search(criteria: SearchCriteria): void {
    this._search({ ...criteria });
  }

  markAsRecent(project: ProjectSearch): void {
    this._loadProject(project.Id);
  }

  removeFilter(removeFilterPayload: RemoveFilterPayload): void {
    let filters: ProjectSearchFilters = { ...this.criteria.filters };
    const isDateFilter =
      removeFilterPayload.ControlName === 'InHandsDate' ||
      removeFilterPayload.ControlName === 'EventDate';
    if (!removeFilterPayload.ClearAll) {
      if (!isDateFilter) {
        filters = {
          ...filters,
          [removeFilterPayload.ControlName]: {
            terms: (
              this.filters[removeFilterPayload.ControlName].terms as string[]
            ).filter(
              (term) =>
                String(term).trim() !== String(removeFilterPayload.Value).trim()
            ),
            behavior: 'any',
          },
        };
      }

      if (
        !filters[removeFilterPayload.ControlName]?.terms?.length ||
        isDateFilter
      ) {
        delete filters[removeFilterPayload.ControlName];
      }
    } else {
      filters = {};
    }

    this.setFilters({
      ...this.criteria,
      filters: {
        ...filters,
      },
    });
  }

  setFilters(criteria: SearchCriteria): void {
    this.filters = mapSearchCriteriaToProjectSearchFilters(criteria);
    this.from = 1;
  }
}
