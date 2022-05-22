import { inject } from '@angular/core/testing';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthFacade } from '@esp/auth';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthFacadeMock } from '@esp/auth/mocks';
import { createPipeFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { FormatCPNPipe } from './format-cpn.pipe';

describe('FormatCPNPipe', () => {
  const createPipe = createPipeFactory({
    pipe: FormatCPNPipe,
    imports: [NgxsModule.forRoot()],
    providers: [
      mockProvider(AuthFacade, {
        user: {},
      }),
    ],
  });

  beforeEach(() => {
    createPipe();
  });

  it('create an instance', inject([AuthFacade], (authFacade: AuthFacade) => {
    const pipe = new FormatCPNPipe(authFacade);
    expect(pipe).toBeTruthy();
  }));

  it('returns empty string if product id is 0', inject(
    [AuthFacade],
    (authFacade: AuthFacade) => {
      authFacade.user.CompanyId = 12345;
      const pipe = new FormatCPNPipe(authFacade);
      const val = pipe.transform(0);
      expect(val).toEqual('');
    }
  ));

  it('returns empty string if product id is not provided', inject(
    [AuthFacade],
    (authFacade: AuthFacade) => {
      authFacade.user.CompanyId = 12345;
      const pipe = new FormatCPNPipe(authFacade);
      const val = pipe.transform();
      expect(val).toEqual('');
    }
  ));

  it('adds 1 to the company id of the user', inject(
    [AuthFacade],
    (authFacade: AuthFacade) => {
      authFacade.user.CompanyId = 12345;
      const pipe = new FormatCPNPipe(authFacade);
      const val = pipe.transform(1);
      expect(val).toEqual('CPN-12346');
    }
  ));

  it('returns empty string when company id does not exist', inject(
    [AuthFacade],
    (authFacade: AuthFacadeMock) => {
      authFacade.user.CompanyId = undefined;
      const pipe = new FormatCPNPipe(authFacade);
      const val = pipe.transform(1);
      expect(val).toEqual('');
    }
  ));
});
