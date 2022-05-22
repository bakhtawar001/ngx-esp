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
import { SearchPageLocalState, TabFilter } from '@esp/search';
import { sortOptions } from '../../configs';
import { ProjectSearchLocalState } from '../../local-states';
import { mapSearchCriteriaToProjectSearchFilters } from '../../utils/filter-params-mapper.util';
import { syncProjectsSetting } from '../../utils/sync-project-setting.state-prop';
import { tabs } from './project-search.config';

// @TODO WJ think about simplifying it, to not duplicate filters logic
@Injectable()
export class ProjectSearchPageLocalState
  extends SearchPageLocalState<ProjectSearchPageLocalState>
  implements ProjectSearchLocalState
{
  override criteria = fromSelector(ProjectsSearchQueries.getCriteria);
  override total = fromSelector(ProjectsSearchQueries.getTotal);
  override sort = syncProjectsSetting('projectSort', sortOptions[0]);
  override get tab(): TabFilter {
    return tabs[this.tabIndex];
  }
  override tabIndex = syncProjectsSetting('searchTabIndex', 0);
  override filters = urlQueryParameter<ProjectSearchFilters>('filters', {
    defaultValue: {},
    debounceTime: 100,
    converter: {
      fromQuery: (
        queryParameterValues: string[],
        defaultValue: ProjectSearchFilters
      ) => {
        return queryParameterValues.length > 0
          ? JSON.parse(decodeURIComponent(queryParameterValues[0]))
          : defaultValue;
      },
      toQuery: (value: ProjectSearchFilters) => {
        const values = value
          ? Object.entries(value).filter(([_, v]) => v != null)
          : [];

        return values?.length
          ? [encodeURIComponent(JSON.stringify(Object.fromEntries(values)))]
          : [];
      },
    },
  });

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

  readonly tabs = tabs;

  private readonly _loadProject = asDispatch(ProjectActions.Get);
  private readonly _search = asDispatch(ProjectSearchActions.Search);

  override setTab(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
    this.from = 1;
  }

  override search(criteria: SearchCriteria): void {
    // we have to clear id, because this view is used in another place, where id param is used
    // but here it is not needed
    this._search({ ...criteria, id: null });
  }

  markAsRecent(project: ProjectSearch): void {
    this._loadProject(project.Id);
  }

  setFilters(criteria: SearchCriteria): void {
    this.filters = mapSearchCriteriaToProjectSearchFilters(criteria);
    this.from = 1;
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
}
