import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import {
  CosDottedButtonComponent,
  CosDottedButtonModule,
} from '../lib/dotted-button.component';

describe('CosDottedButtonComponent', () => {
  let component: CosDottedButtonComponent;
  let spectator: SpectatorHost<CosDottedButtonComponent>;

  const createHost = createHostFactory({
    component: CosDottedButtonComponent,
    imports: [CosDottedButtonModule],
  });

  beforeEach(() => {
    spectator = createHost(
      `<cos-dotted-button title="Test"></cos-dotted-button>`
    );
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.queryHost('cos-dotted-button')).toBeTruthy();
  });
});
