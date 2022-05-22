import { FilterPill } from '@asi/ui/feature-filters';
import { CompanySearchFilters } from '../models';
import { Aggregations } from '../models';

export function mapFilterPills(
  filters: CompanySearchFilters,
  facets: Aggregations
): FilterPill[] {
  return (
    filters?.Owners?.terms
      ?.map((id) => {
        const name = facets?.Owners?.find((owner) => owner.Id === id)?.Name;
        return name
          ? { ControlName: 'Owners', Label: `Owner: ${name}`, Value: id }
          : null;
      })
      .filter(Boolean) ?? []
  );
}
