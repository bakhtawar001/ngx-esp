import { FilterPill } from '@asi/ui/feature-filters';
import { Aggregations, ProjectSearchFilters } from '@esp/projects';
import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('en-US');

export const filterPillsMapper = (
  filters: ProjectSearchFilters,
  facets: Aggregations
): FilterPill[] => {
  const pills: FilterPill[] = [];
  filters?.Owners?.terms?.forEach((ownerId) => {
    const ownerName = facets.Owners?.find(
      (ownerOptions) => ownerOptions.Id === ownerId
    )?.Name;

    if (ownerName) {
      pills.push({
        ControlName: 'Owners',
        Label: `Owner: ${ownerName}`,
        Value: ownerId,
      });
    }
  });

  filters?.StepName?.terms?.forEach((step) => {
    pills.push({
      ControlName: 'StepName',
      Label: `Project Phase: ${step}`,
      Value: step,
    });
  });

  if (filters?.InHandsDate?.terms.length) {
    pills.push({
      ControlName: 'InHandsDate',
      Label: `In Hands Date: from: ${mapDateToPillLabel(
        filters?.InHandsDate?.terms[0]
      )} - to: ${mapDateToPillLabel(filters?.InHandsDate?.terms[1])}`,
      Value: 'In Hands Date',
    });
  }

  if (filters?.EventDate?.terms.length) {
    pills.push({
      ControlName: 'EventDate',
      Label: `Event Date: from: ${mapDateToPillLabel(
        filters?.EventDate?.terms[0]
      )} - to: ${mapDateToPillLabel(filters?.EventDate?.terms[1])}`,
      Value: 'Event Date',
    });
  }

  return pills;
};

function mapDateToPillLabel(isoDate: string | number): string {
  return datePipe.transform(new Date(isoDate), 'MM/dd/YYYY');
}
