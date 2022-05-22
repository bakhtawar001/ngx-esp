import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { CosAvatarModule } from '../avatar.module';
import { CosAvatarComponent } from './avatar.component';

describe('CosAvatarComponent', () => {
  let component: CosAvatarComponent;
  let spectator: SpectatorHost<CosAvatarComponent>;

  const createHost = createHostFactory({
    component: CosAvatarComponent,
    imports: [CosAvatarModule],
  });

  beforeEach(() => {
    spectator = createHost(`<cos-avatar>AB</cos-avatar>`);
    component = spectator.component;
  });

  it('should exist', () => {
    expect(spectator.queryHost('cos-avatar')).toBeTruthy();
  });
});
