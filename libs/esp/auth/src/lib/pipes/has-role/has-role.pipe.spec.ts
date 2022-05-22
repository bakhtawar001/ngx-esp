import {
  createPipeFactory,
  mockProvider,
  SpectatorPipe,
} from '@ngneat/spectator/jest';
import { AuthFacade } from '../../services';
import { HasRolePipe, HasRolePipeModule } from './has-role.pipe';

describe('HasRolePipe', () => {
  let spectator: SpectatorPipe<HasRolePipe>;

  const createPipe = createPipeFactory({
    pipe: HasRolePipe,
    imports: [HasRolePipeModule],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          hasRole: jest.fn((role) => role === 'Administrator'),
        },
      }),
    ],
  });

  it('should match Administrator role', () => {
    spectator = createPipe(`{{ 'Administrator' | hasRole }}`);
    expect(spectator.element).toHaveText('true');
  });

  it('should not match User role', () => {
    spectator = createPipe(`{{ 'User' | hasRole }}`);
    expect(spectator.element).toHaveText('false');
  });
});
