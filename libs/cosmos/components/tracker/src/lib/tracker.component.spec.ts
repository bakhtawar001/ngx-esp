import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosTrackerComponent } from './tracker.component';
import { CosTrackerModule } from './tracker.module';

describe('CosTrackerComponent', () => {
  let spectator: SpectatorHost<CosTrackerComponent>;

  const createHost = createHostFactory({
    component: CosTrackerComponent,
    imports: [CosTrackerModule],
  });

  beforeEach(() => {
    spectator = createHost(
      `<div class="cos-tooltip-demo-container">
      <cos-tracker>
        <cos-tracker-step color="green"></cos-tracker-step>
        <cos-tracker-step color="green"></cos-tracker-step>
        <cos-tracker-step
          color="yellow"
          matTooltip="There is an alert here!"
          matTooltipPosition="below"
          matTooltipHideDelay="100"
          ><i class="fa fa-exclamation-triangle cos-text--white"></i
        ></cos-tracker-step>
        <cos-tracker-step></cos-tracker-step>
        <cos-tracker-step></cos-tracker-step>
      </cos-tracker>
    </div>`
    );
  });

  it('should exist', () => {
    expect(spectator.queryHost('.cos-tracker')).toBeTruthy();
  });
});
