import { SearchCriteria, ProjectSearchFilters } from '@esp/projects';

export function mapSearchCriteriaToProjectSearchFilters(
  criteria: SearchCriteria
): ProjectSearchFilters {
  let values: ProjectSearchFilters = {};

  if (criteria.filters) {
    values = {
      StepName: criteria.filters?.StepName,
      Owners: criteria.filters?.Owners,
      EventDate: criteria.filters?.EventDate,
      InHandsDate: criteria.filters?.InHandsDate,
    };
  }

  const urlFilters = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v != null)
  );

  return urlFilters;
}
