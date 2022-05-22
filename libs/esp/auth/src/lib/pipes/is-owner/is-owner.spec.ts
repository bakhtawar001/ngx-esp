import { IsOwnerPipe, IsOwnerPipeModule } from '@esp/auth';
import {
  createPipeFactory,
  mockProvider,
  SpectatorPipe,
} from '@ngneat/spectator/jest';
import { AuthFacade } from '../../services';

const userId = 1;

describe('IsOwnerPipe', () => {
  let spectator: SpectatorPipe<IsOwnerPipe>;

  const createPipe = createPipeFactory({
    pipe: IsOwnerPipe,
    imports: [IsOwnerPipeModule],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          Id: userId,
        },
      }),
    ],
  });

  it('should return false when user is not the owner', () => {
    spectator = createPipe('{{ 0 | isOwner }}');
    expect(spectator.element).toHaveText('false');
  });

  it('should return true when user is the owner', () => {
    spectator = createPipe(`{{ ${userId} | isOwner }}`);
    expect(spectator.element).toHaveText('true');
  });
});
