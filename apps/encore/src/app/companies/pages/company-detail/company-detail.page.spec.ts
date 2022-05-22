import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { dataCySelector } from '@cosmos/testing';
import { HasRolePipe, IsCollaboratorPipe, IsOwnerPipe } from '@esp/auth';
import { CompaniesMockDb } from '@esp/companies/mocks';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { CompanyDetailLocalState } from '../../local-states';
import { CompanySearchPage } from '../company-search/company-search.page';
import {
  CompanyDetailPage,
  CompanyDetailPageModule,
} from './company-detail.page';
import { MatDialog } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';
import { AsiCompanyActionsItemsComponent } from '@asi/company/ui/feature-components';
import { ContactsMockDb } from '@esp/contacts/mocks';

const company = CompaniesMockDb.Companies[0];
const contactMock = ContactsMockDb.Contacts[0];

describe('CompanyDetailPage', () => {
  const createComponent = createComponentFactory({
    component: CompanyDetailPage,
    imports: [
      RouterTestingModule.withRoutes([
        {
          path: 'directory/companies',
          component: CompanySearchPage,
        },
      ]),
      NgxsModule.forRoot(),
      CompanyDetailPageModule,
    ],
    providers: [
      mockProvider(ActivatedRoute, {
        snapshot: {
          queryParamMap: { getAll: (key: string) => ['contact'] },
        },
        params: of({ id: company.Id }),
        queryParamMap: of({ getAll: () => ({ type: 'contact' }) }),
      }),
      mockProvider(CompanyDetailLocalState),
      { provide: Location, useClass: SpyLocation },
      mockProvider(MatDialog, {
        open: () => of({}),
      }),
    ],
    declarations: [MockComponent(AsiCompanyActionsItemsComponent)],
  });

  const testSetup = (options?: {
    manageDialogResult?: boolean;
    isAccessLevelEveryone?: boolean;
    isAdmin?: boolean;
    isCollaboratorWithAccess?: boolean;
    isOwner?: boolean;
    isEditable?: boolean;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(CompanyDetailLocalState, <
          Partial<CompanyDetailLocalState>
        >{
          isLoading: false,
          connect() {
            return of(this);
          },
          party: {
            ...company,
            ...(options?.isAccessLevelEveryone && { AccessLevel: 'Everyone' }),
            ...(options?.isEditable && { IsEditable: options.isEditable }),
          },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          save: () => {},
          transferOwnership: (company, newOwner) => EMPTY,
          deleteCompany: (company) => EMPTY,
          toggleStatus: (company, isActive) => EMPTY,
        }),
        mockProvider(CollaboratorsDialogService, {
          openManageCollaboratorsDialog: () =>
            of(options?.manageDialogResult ? ({} as never) : null),
        }),
        mockProvider(HasRolePipe, {
          transform: () => options?.isAdmin ?? false,
        }),
        mockProvider(IsCollaboratorPipe, {
          transform: () => options?.isCollaboratorWithAccess ?? false,
        }),
        mockProvider(IsOwnerPipe, {
          transform: () => options?.isOwner ?? false,
        }),
      ],
    });

    const collaboratorsDialogService = spectator.inject(
      CollaboratorsDialogService,
      true
    );
    const state = spectator.inject(CompanyDetailLocalState, true);

    spectator.detectComponentChanges();

    return {
      spectator,
      component: spectator.component,
      collaboratorsDialogService,
      state,
    };
  };

  it('should create', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('Back to directory nav', () => {
    it('should exist back to directory nav link', () => {
      // Arrange
      const { spectator } = testSetup();

      // Act
      const backToDirectoryLink = spectator.query(
        '.company-detail-header-link'
      );

      // Assert
      expect(backToDirectoryLink.textContent).toContain('Back to Directory');
    });

    it('should navigate to companies with preserved query params (because the state is not empty) when the "Back to Directory" link is clicked', () => {
      // Arrange
      const { spectator, component } = testSetup();

      // This is just a read-only prorerty.
      (
        component as unknown as {
          currentNavigation: Pick<Navigation, 'extras'>;
        }
      )['currentNavigation'] = {
        extras: {
          state: {
            backToDirectoryUrl: '/directory/companies?q=asi',
          },
        },
      };

      const router = spectator.inject(Router);
      jest
        .spyOn(router, 'navigateByUrl')
        .mockReturnValue(Promise.resolve(true));

      // Act
      const backToDirectoryLink = spectator.query(
        '.company-detail-header-link'
      );
      spectator.click(backToDirectoryLink);

      // Assert
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/directory/companies?q=asi'
      );
    });

    it('should navigate to companies w/o query params (because the state is empty) when the "Back to Directory" link is clicked', () => {
      // Arrange
      const { spectator } = testSetup();

      // Act
      const router = spectator.inject(Router);

      jest
        .spyOn(router, 'navigateByUrl')
        .mockReturnValue(Promise.resolve(true));

      const backToDirectoryLink = spectator.query(
        '.company-detail-header-link'
      );
      spectator.click(backToDirectoryLink);

      // Assert
      expect(router.navigateByUrl).toHaveBeenCalledWith('/directory/companies');
    });
  });

  describe('company profile image', () => {
    // Would FAIL, since the ngIf condition checks for value that is non-existent.
    // ngIf condition should check for: 'state.party.ProfileImageUrl' instead of 'state.party.IconMediaLink.FileUrl'.

    // it('should display profile image', () => {
    //   //Arrange
    //   const { spectator, component } = testSetup();
    //   const profileImage = spectator.query('img');

    //   //Assert
    //   expect(component.state.party.ProfileImageUrl).toEqual(
    //     company.ProfileImageUrl
    //   );
    //   expect(profileImage).toExist();
    //   expect(profileImage).toHaveAttribute('src', company.ProfileImageUrl);
    // });

    it('should display default profile image if company profile image url is not available', fakeAsync(() => {
      // Arrange
      const { spectator, component } = testSetup();

      // Act
      component.state.party.ProfileImageUrl = null;
      spectator.detectComponentChanges();

      const defaultImage = spectator.query('.fa.fa-building');

      // Assert
      expect(defaultImage).toBeVisible();
    }));
  });

  describe('Company details display', () => {
    it('should display company name correctly', () => {
      // Arrange
      const { spectator, component } = testSetup();

      // Act
      component.state.party.Name = 'Test name';
      spectator.detectComponentChanges();
      const companyNameHeader = spectator.query('.detail-header--entity-title');

      // Assert
      expect(companyNameHeader).toHaveText('Test name');
    });

    it('should show the 3 dot menu option when Edit permission is allowed', () => {
      const { spectator } = testSetup({
        isEditable: true,
      });
      const threeDotsBtn = spectator.query(
        '.mat-menu-trigger.detail-header-action-btns--trigger'
      );

      expect(threeDotsBtn).toExist();
      expect(threeDotsBtn).toHaveDescendant('.fa.fa-ellipsis-h');
    });

    it('should hide the 3 dot menu when User does not have permission to Edit', () => {
      const { spectator } = testSetup({
        isEditable: false,
      });
      const threeDotsBtn = spectator.query(
        '.mat-menu-trigger.detail-header-action-btns--trigger'
      );

      // Assert
      expect(threeDotsBtn).not.toExist();
    });

    it('should display actions menu when 3 dots button is clicked', () => {
      // Arrange
      const { spectator, state } = testSetup({
        isEditable: true,
      });
      const threeDotsBtn = spectator.query(
        '.mat-menu-trigger.detail-header-action-btns--trigger'
      );
      jest.spyOn(state, 'partyIsReady', 'get').mockReturnValue(true);

      // Act
      spectator.click(threeDotsBtn);
      spectator.detectComponentChanges();
      const actionsMenuComponent = spectator.query(
        AsiCompanyActionsItemsComponent
      );

      // Assert
      expect(actionsMenuComponent).toExist();
    });

    it("should display owner's name detail correctly", () => {
      // Arrange
      const { spectator, component } = testSetup();

      // Act
      component.state.party.Owner.Name = 'test name';
      spectator.detectComponentChanges();
      const ownerDetail = spectator.query('esp-detail-header-meta');

      // Assert
      expect(ownerDetail.children[1].children[0]).toHaveText('Managed by');
      expect(ownerDetail.children[1].children[1]).toHaveText(
        component.state.party.Owner.Name
      );
    });

    it("should diplay the collaborator's avatar list", () => {
      // Arrange
      const { spectator } = testSetup();
      const avatarList = spectator.query('cos-avatar-list');

      // Assert
      expect(avatarList).toExist();
    });

    it('should display the navigation menu on the left side', () => {
      // Arrange
      const { spectator } = testSetup();
      const navigationMenu = spectator.query('.cos-vertical-menu--desktop');

      // Assert
      expect(navigationMenu).toExist();
    });

    it('should display all menu items under the navigation menu', () => {
      // Arrange
      const { spectator, component } = testSetup();
      const menuItems = spectator.queryAll('cos-vertical-navigation-item');

      // Assert
      expect(menuItems.length).toBeGreaterThan(0);
      expect(menuItems[0].children[0]).toHaveText(component.menu[0].title);
      expect(menuItems[1].children[0]).toHaveText(component.menu[1].title);
      expect(menuItems[2].children[0]).toHaveText(component.menu[2].title);
    });

    it('should when viewing a company detail select the left navigation option ‘Contacts’ and see this Company’s Contacts', () => {
      // Arrange
      const { spectator } = testSetup();
      const contactmenuItem = spectator.queryAll(
        'cos-vertical-navigation-item > cos-navigation-item > a'
      )[2];

      // Assert
      expect(contactmenuItem).toExist();
      expect(contactmenuItem).toHaveText('Contacts');
    });
  });

  describe('Manage collaborators', () => {
    const manageButton = dataCySelector('manage-collaborators-button');

    it('should not contain button to manage if user is not an admin, not an owner and not a collaborator with write access, and there is no access level for everyone set', () => {
      const { spectator } = testSetup({
        isAccessLevelEveryone: false,
        isAdmin: false,
        isCollaboratorWithAccess: false,
        isOwner: false,
      });

      expect(spectator.query(manageButton)).toBeFalsy();
    });

    it('should contain button to manage if company access level is everyone', () => {
      const { spectator } = testSetup({ isAccessLevelEveryone: true });

      expect(spectator.query(manageButton)).toBeTruthy();
    });

    it('should contain button to manage if user is admin', () => {
      const { spectator } = testSetup({ isAdmin: true });

      expect(spectator.query(manageButton)).toBeTruthy();
    });

    it('should contain button to manage if user is owner of the record', () => {
      const { spectator } = testSetup({ isOwner: true });

      expect(spectator.query(manageButton)).toBeTruthy();
    });

    it('should contain button to manage if user is collaborator with write access', () => {
      const { spectator } = testSetup({ isCollaboratorWithAccess: true });

      expect(spectator.query(manageButton)).toBeTruthy();
    });

    it('clicking on manage button should open Manage collaborators dialog', () => {
      const { spectator, collaboratorsDialogService } = testSetup({
        isAdmin: true,
      });
      jest.spyOn(collaboratorsDialogService, 'openManageCollaboratorsDialog');

      spectator.click(manageButton);

      expect(
        collaboratorsDialogService.openManageCollaboratorsDialog
      ).toHaveBeenCalled();
    });

    it('should update the company when dialog is closed with result', fakeAsync(() => {
      const { spectator, state } = testSetup({
        isAdmin: true,
        manageDialogResult: true,
      });
      jest.spyOn(state, 'save');

      spectator.click(manageButton);
      spectator.tick();

      expect(state.save).toHaveBeenCalled();
    }));

    it('should not update the company when dialog is closed without result', fakeAsync(() => {
      const { spectator, state } = testSetup({
        isAdmin: true,
        manageDialogResult: false,
      });
      jest.spyOn(state, 'save');

      spectator.click(manageButton);
      spectator.tick();

      expect(state.save).not.toHaveBeenCalled();
    }));
  });

  describe('Actions Items', () => {
    it('should dispatch CompaniesActions.TransferOwnership', () => {
      const { component, collaboratorsDialogService } = testSetup();

      const stateSpy = jest.spyOn(component.state, 'transferOwnership');
      jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(contactMock));

      component.onTransferOwner();

      expect(stateSpy).toHaveBeenCalled();
    });

    it('should dispatch CompaniesActions.Delete', () => {
      const { component, spectator } = testSetup();

      const dialog = spectator.inject(MatDialog);
      const stateSpy = jest.spyOn(component.state, 'deleteCompany');
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of({}),
      } as any);

      component.onDelete();

      expect(stateSpy).toHaveBeenCalled();
    });

    it('should dispatch CompaniesActions.ToggleStatus', () => {
      const { component } = testSetup();

      const stateSpy = jest.spyOn(component.state, 'toggleStatus');

      component.onToggleStatus();

      expect(stateSpy).toHaveBeenCalled();
    });
  });
});
