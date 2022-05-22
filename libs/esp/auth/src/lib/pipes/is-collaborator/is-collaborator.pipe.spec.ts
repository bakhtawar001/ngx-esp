import { IsCollaboratorPipe, IsCollaboratorPipeModule } from '@esp/auth';
import {
  createPipeFactory,
  mockProvider,
  SpectatorPipe,
} from '@ngneat/spectator/jest';
import { AuthFacade } from '../../services';

const userId = 1;

describe('IsCollaboratorPipe', () => {
  let spectator: SpectatorPipe<IsCollaboratorPipe>;

  const createPipe = createPipeFactory({
    pipe: IsCollaboratorPipe,
    imports: [IsCollaboratorPipeModule],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          Id: userId,
        },
      }),
    ],
  });

  it('should return false if user is not a collaborator', () => {
    spectator = createPipe('{{ [{ UserId: 2 }] | isCollaborator: "Read" }}');
    expect(spectator.element).toHaveText('false');
  });

  it('should return false if user is collaborator but without requested access type', () => {
    spectator = createPipe(
      `{{ [{ UserId: ${userId}, AccessType: "ReadWrite" }] | isCollaborator: "Read" }}`
    );
    expect(spectator.element).toHaveText('false');
  });

  it('should return true if user is collaborator with requested access type', () => {
    spectator = createPipe(
      `{{ [{ UserId: ${userId}, AccessType: "Read" }] | isCollaborator: "Read" }}`
    );
    expect(spectator.element).toHaveText('true');
  });
});
