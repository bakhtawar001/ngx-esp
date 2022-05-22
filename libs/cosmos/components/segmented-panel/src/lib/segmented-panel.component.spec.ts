import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosSegmentedPanelComponent } from './segmented-panel.component';
import { CosSegmentedPanelModule } from './segmented-panel.module';

const template = `
    <cos-segmented-panel>
      <cos-segmented-panel-header>
        <h2 class="header-style-16 mb-0">Header</h2>
      </cos-segmented-panel-header>
      <cos-segmented-panel-row> Row 1</cos-segmented-panel-row>
      <cos-segmented-panel-row> Row 2</cos-segmented-panel-row>
      <cos-segmented-panel-row> Row 3</cos-segmented-panel-row>
    </cos-segmented-panel>
  `;

describe('CosSegmentedPanel', () => {
  let component: CosSegmentedPanelComponent;
  let spectator: SpectatorHost<CosSegmentedPanelComponent>;

  const createHost = createHostFactory({
    component: CosSegmentedPanelComponent,
    imports: [CosSegmentedPanelModule],
  });

  beforeEach(() => {
    spectator = createHost(template);
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.queryHost('.cos-segmented-panel')).toBeTruthy();
  });
});
