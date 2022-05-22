import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { EspAutocompleteModule } from '@esp/autocomplete';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  AsiUserTeamAutocompleteComponent,
  AsiUserTeamAutocompleteComponentModule,
} from './user-team-autocomplete.component';

const userAndTeams = [
  {
    UserId: 535278,
    Name: 'testuserr testuserr',
    IsTeam: false,
    Role: 'Owner',
  },
  {
    UserId: 285221,
    Name: 'Adnan Khan',
    Email: 'adnankhan@asicentral.com',
    IsTeam: false,
    Role: 'Administrator',
  },
  {
    IsTeam: true,
    PersonId: 123,
    IsVisible: true,
    Id: 12,
    Name: 'Team A',
  },
  {
    IsTeam: true,
    PersonId: 321,
    IsVisible: true,
    Id: 13,
    Name: 'Team B',
  },
];

const users = [
  {
    UserId: 535278,
    Name: 'testuserr testuserr',
    IsTeam: false,
    Role: 'Owner',
  },
  {
    UserId: 285221,
    Name: 'Adnan Khan',
    Email: 'adnankhan@asicentral.com',
    IsTeam: false,
    Role: 'Administrator',
  },
];

describe('AsiUserTeamAutoCompleteComponent', () => {
  let spectator: Spectator<AsiUserTeamAutocompleteComponent>;
  let component: AsiUserTeamAutocompleteComponent;
  let spyFn: jest.SpyInstance;
  let input: any;

  const createComponent = createComponentFactory({
    component: AsiUserTeamAutocompleteComponent,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EspAutocompleteModule,
      AsiUserTeamAutocompleteComponentModule,
    ],
  });

  beforeEach(fakeAsync(() => {
    spectator = createComponent({
      props: {
        excludeList: 'baby,pampers,fashion,luxury',
      },
    });
    component = spectator.component;

    spectator.tick(200);

    input = {
      excludeList: 'baby,pampers,fashion,luxury',
      filters: '',
      from: 1,
      sortBy: '',
      status: 'Active',
      term: '',
    };
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('User should not be able to add an owner again since its already listed and should not show up in search', () => {
    const selectedOwnerId = 535278;
    component.excludeTeams = false;
    component.state.usersAndTeams = userAndTeams;
    component.state.usersAndTeams = component.state.usersAndTeams.filter(
      (entity) =>
        entity.UserId
          ? entity.UserId !== selectedOwnerId
          : entity.PersonId !== selectedOwnerId
    );
    spectator.detectChanges();
    expect(component.options).toEqual(component.state.usersAndTeams);
  });

  it('User should not be able to add same individual more than once, should not show up in search if already added', () => {
    const selectedUserId = 535278;
    component.excludeTeams = false;
    component.state.usersAndTeams = userAndTeams;
    component.state.usersAndTeams = component.state.usersAndTeams.filter(
      (entity) =>
        entity.UserId
          ? entity.UserId !== selectedUserId
          : entity.PersonId !== selectedUserId
    );
    spectator.detectChanges();
    expect(component.options).toEqual(component.state.usersAndTeams);
  });

  it('User should not be able to add same Team more than once, should not show up in search if already added', () => {
    const selectedTeamId = 123;
    component.excludeTeams = false;
    component.state.usersAndTeams = userAndTeams;
    component.state.usersAndTeams = component.state.usersAndTeams.filter(
      (entity) =>
        entity.UserId
          ? entity.UserId !== selectedTeamId
          : entity.Id !== selectedTeamId
    );
    spectator.detectChanges();
    expect(component.options).toEqual(component.state.usersAndTeams);
  });

  it('Teams should not be available in the new owner dropdown', () => {
    component.excludeTeams = true;
    component.state.users = users;
    spectator.detectChanges();
    expect(component.options).toEqual(component.state.users);
  });

  it('Current owner should not be listed in the users dropdown', () => {
    const selectedUserId = 535278;
    component.excludeTeams = true;
    component.state.users = users;
    component.state.users = component.state.users.filter(
      (entity) => entity.UserId !== selectedUserId
    );
    spectator.detectChanges();
    expect(component.options).toEqual(component.state.users);
  });

  // @TODO change tests - autocomplete facade is removed
  // it('User should be able to search on the basis of First name of the users.', fakeAsync(() => {
  //   autocompleteFacade = spectator.inject(AutocompleteFacade, true);
  //   spyFn = jest.spyOn(autocompleteFacade, 'searchUsers');
  //
  //   input.term = 'firstname';
  //   component.excludeTeams = true;
  //   component.state.users = users;
  //   component.searchForm.patchValue({ term: input.term });
  //
  //   spectator.tick(200);
  //
  //   expect(spyFn).toHaveBeenCalledWith(input);
  // }));
  //
  // it('User should be able to search on the basis of Teams Name.', fakeAsync(() => {
  //   autocompleteFacade = spectator.inject(AutocompleteFacade, true);
  //   spyFn = jest
  //     .spyOn(autocompleteFacade, 'searchUsersAndTeams')
  //     .mockReturnValue(of('test value'));
  //
  //   component.excludeTeams = false;
  //   input.term = 'Team A';
  //
  //   component.state.usersAndTeams = userAndTeams;
  //   component.searchForm.get('term').setValue(input.term);
  //   spectator.detectComponentChanges();
  //   tick(200);
  //   expect(spyFn).toHaveBeenCalled();
  //
  //   expect(spyFn).toHaveBeenCalledWith(input);
  // }));
  //
  // it('List should be correctly populated when user types in the special characters in search text box.', fakeAsync(() => {
  //   autocompleteFacade = spectator.inject(AutocompleteFacade, true);
  //   spyFn = jest
  //     .spyOn(autocompleteFacade, 'searchUsersAndTeams')
  //     .mockReturnValue(of('test value'));
  //
  //   component.excludeTeams = false;
  //   input.term = '@#$';
  //
  //   component.state.usersAndTeams = userAndTeams;
  //   component.searchForm.get('term').setValue(input.term);
  //   spectator.detectComponentChanges();
  //
  //   tick(200);
  //   expect(spyFn).toHaveBeenCalled();
  //
  //   expect(spyFn).toHaveBeenCalledWith(input);
  // }));
  //
  // it('List should be populated correctly when user types in alpha numeric and special characters in the search text box ', fakeAsync(() => {
  //   autocompleteFacade = spectator.inject(AutocompleteFacade, true);
  //   spyFn = jest
  //     .spyOn(autocompleteFacade, 'searchUsersAndTeams')
  //     .mockReturnValue(of('test value'));
  //
  //   component.excludeTeams = false;
  //   input.term = 'Team123&@#$';
  //
  //   component.state.usersAndTeams = userAndTeams;
  //   component.searchForm.get('term').setValue(input.term);
  //   spectator.detectComponentChanges();
  //   tick(200);
  //   expect(spyFn).toHaveBeenCalled();
  //
  //   expect(spyFn).toHaveBeenCalledWith(input);
  // }));
});
