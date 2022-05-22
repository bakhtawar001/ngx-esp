import { InjectionToken } from '@angular/core';
import { FilterPill, RemoveFilterPayload } from '@asi/ui/feature-filters';
import { Dictionary } from '@cosmos/core';
import {
  BaseProject,
  CommaSeperatedStringValues,
  SearchFilter,
} from '@esp/models';
import {
  Aggregations,
  OwnerAggregation,
  ProjectClosePayload,
} from '@esp/projects';
import { SearchLocalState, TabFilter } from '@esp/search';

export const PROJECT_SEARCH_LOCAL_STATE =
  new InjectionToken<ProjectSearchLocalState>('ESP Project Search Local State');

// @TODO WJ think about simplifying it, to not duplicate filters logic
export abstract class ProjectSearchLocalState extends SearchLocalState<ProjectSearchLocalState> {
  abstract filterPills: FilterPill[];
  abstract isLoading: boolean;
  abstract hasLoaded: boolean;
  abstract projects: BaseProject[];
  abstract tabs: TabFilter[];
  abstract facets: Aggregations;
  abstract ownerFacets: OwnerAggregation[];
  abstract stepNameFacets: string[];

  abstract closeProject(payload: ProjectClosePayload): void;

  abstract markAsRecent(project: BaseProject): void;

  abstract removeFilter(payload: RemoveFilterPayload): void;

  abstract reopenProject(project: BaseProject): void;

  abstract setFilters(param: {
    size: number;
    excludeList?: CommaSeperatedStringValues;
    letter?: string;
    from: number;
    sortBy?: Dictionary<string> | string;
    term?: string;
    filters: {
      InHandsDate?: SearchFilter;
      EventDate?: SearchFilter;
      StepName?: SearchFilter;
      Owners?: SearchFilter;
    };
    id?: number;
    type?: string;
    editOnly?: boolean;
    status?: string;
  }): void;

  abstract transferOwnership(project: BaseProject, newOwnerId: number): void;
}
