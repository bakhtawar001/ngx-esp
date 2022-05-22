import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosFiltersComponent } from './filters.component';
import { CosFiltersModule } from './filters.module';

const template = `
    <cos-filters>
      <cos-filter-menu label="Categories" [applied]="true">
        <p>Menu Content</p>
      </cos-filter-menu>
    </cos-filters>
  `;

describe('CosFiltersComponent', () => {
  let component: CosFiltersComponent;
  let spectator: SpectatorHost<CosFiltersComponent>;

  const createHost = createHostFactory({
    component: CosFiltersComponent,
    imports: [CosFiltersModule],
  });

  beforeEach(() => {
    spectator = createHost(template, {
      hostProps: {
        applied: false,
      },
    });
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.queryHost('.cos-filters')).toBeTruthy();
  });
});
