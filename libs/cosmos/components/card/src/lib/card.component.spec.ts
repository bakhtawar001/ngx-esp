import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosCardComponent } from './card.component';
import { CosCardModule } from './card.module';

const template = `
    <cos-card>
      <p>This is a card</p>
    </cos-card>
  `;

describe('CosCardComponent', () => {
  let component: CosCardComponent;
  let spectator: SpectatorHost<CosCardComponent>;

  const createHost = createHostFactory({
    component: CosCardComponent,
    imports: [CosCardModule],
  });

  beforeEach(() => {
    spectator = createHost(template);
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.queryHost('.cos-card')).toBeTruthy();
  });
});
