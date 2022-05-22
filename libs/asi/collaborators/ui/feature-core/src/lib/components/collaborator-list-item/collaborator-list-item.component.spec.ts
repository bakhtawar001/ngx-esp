import { Collaborator } from '@esp/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import {
  AsiCollaboratorListItemComponent,
  AsiCollaboratorListItemComponentModule,
} from './collaborator-list-item.component';

describe('AsiCollaboratorListItemComponent', () => {
  let spectator: Spectator<AsiCollaboratorListItemComponent>;
  let component: AsiCollaboratorListItemComponent;

  const createComponent = createComponentFactory({
    component: AsiCollaboratorListItemComponent,
    imports: [AsiCollaboratorListItemComponentModule],
  });

  beforeEach(() => {
    const collaborator = {
      AccessType: 'Read',
      Role: 'Owner',
      UserId: 123,
    } as Collaborator;

    spectator = createComponent({
      props: {
        collaborator,
      },
    });

    component = spectator.component;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('Should set style to display none on imgError', () => {
    const event = { target: { style: { display: '' } } };

    component.imgError(event);

    expect(event.target.style.display).toBeTruthy();
    expect(event.target.style.display).toEqual('none');
  });

  it('Only owner badge should be displayed next to an Admin that is an owner', () => {
    spectator.setInput('ownerId', 285221);
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'Administrator',
    });
    const ownerBadge = spectator.query('.collaborator-role > span');
    expect(ownerBadge).toExist();
    expect(ownerBadge).toHaveText('Owner');
    const adminBadge = spectator.query('.admin-badge');
    expect(adminBadge).not.toExist();
  });

  it('Admin badge should be displayed next to an Admin which is not an owner', () => {
    spectator.setInput('ownerId', 285222);
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'Administrator',
    });
    const adminBadge = spectator.query('.collaborator-role > span');
    expect(adminBadge).toExist();
    expect(adminBadge).toHaveText('Admin');
  });

  it('User should not be able to update the admins permissions i.e. the permissions options should be disabled', () => {
    spectator.setInput('ownerId', 285222);
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'Administrator',
    });
    const collaboratorActionSection = spectator.query('.collaborator-actions');
    expect(collaboratorActionSection).not.toExist();
  });

  it('User added should be displayed as First Name Last Name and Primary email address', () => {
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'User',
    });
    const userName = spectator.query('.account-item > div > h4');
    expect(userName).toExist();
    expect(userName).toHaveText(component.collaborator.Name);
    const userEmail = spectator.query('.account-item > div > div');
    expect(userEmail).toExist();
    expect(userEmail).toHaveText(component.collaborator.Email);
  });

  it('Permissions dropdown should be listed next to the user and should be enabled', () => {
    spectator.setInput('ownerId', 285222);
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'User',
    });
    const collaboratorActionSection = spectator.query('.collaborator-actions');
    expect(collaboratorActionSection).toExist();
  });

  it("Permissions dropdown should be listed with options 'Can Edit', 'Can View' and 'Remove'", () => {
    spectator.setInput('ownerId', 285222);
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'User',
      AccessType: 'Read',
    });
    const selectBtn = spectator.query('.select-button');
    expect(selectBtn).toExist();
    spectator.click(selectBtn);
    spectator.detectChanges();
    const menuItems = spectator.queryAll('.action-menu-item');
    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toHaveText(component.accessTypes.ReadWrite.Name);
    expect(menuItems[1]).toHaveText(component.accessTypes.Read.Name);
    expect(menuItems[2]).toHaveText('Remove');
  });

  it("Text below 'Can Edit', in permissions dropdown, should be displayed as 'can edit but not share with others'", () => {
    spectator.setInput('ownerId', 285222);
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'User',
    });
    const selectBtn = spectator.query('.select-button');
    expect(selectBtn).toExist();
    spectator.click(selectBtn);
    spectator.detectChanges();
    const menuItems = spectator.queryAll('.action-menu-item');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveText(component.accessTypes.ReadWrite.Name);
    const menuItemsDescription = spectator.queryAll('.action-menu-item > span');
    expect(menuItemsDescription).toHaveLength(2);
    expect(menuItemsDescription[0]).toHaveText(
      component.accessTypes.ReadWrite.Description
    );
  });

  it("Text below 'Can View', in permissions dropdown, should be displayed as 'cannot edit or share with others'", () => {
    spectator.setInput('ownerId', 285222);
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'User',
    });
    const selectBtn = spectator.query('.select-button');
    expect(selectBtn).toExist();
    spectator.click(selectBtn);
    spectator.detectChanges();

    const menuItems = spectator.queryAll('.action-menu-item');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[1]).toHaveText(component.accessTypes.Read.Name);

    const menuItemsDescription = spectator.queryAll('.action-menu-item > span');
    expect(menuItemsDescription).toHaveLength(2);
    expect(menuItemsDescription[1]).toHaveText(
      component.accessTypes.Read.Description
    );
  });

  it('When an option is selected from the permissions dropdown a tick should appear next to the option', () => {
    spectator.setInput('ownerId', 285222);
    spectator.setInput('collaborator', {
      UserId: 285221,
      Name: 'Adnan Khan',
      Email: 'adnankhan@asicentral.com',
      IsTeam: false,
      Role: 'User',
      AccessType: 'Read',
    });
    const selectBtn = spectator.query('.select-button');
    expect(selectBtn).toExist();
    spectator.click(selectBtn);
    spectator.detectChanges();
    const selectedIcon = spectator.queryAll('.action-menu-item > i');
    expect(selectedIcon).toHaveLength(1);
    expect(selectedIcon[0].tagName).toBe('I');
    expect(selectedIcon[0]).toHaveClass(['fa', 'fa-check']);
  });

  it('When a team is added, it should be listed correctly with the team name', () => {
    spectator.setInput('collaborator', {
      IsTeam: true,
      UserId: 123,
      Name: 'Team A',
      Role: 'Team',
    });
    const teamName = spectator.query('.account-item > div > h4');
    expect(teamName).toExist();
    expect(teamName).toHaveText(component.collaborator.Name);
    expect(teamName).toHaveText('Team A');
  });
});
