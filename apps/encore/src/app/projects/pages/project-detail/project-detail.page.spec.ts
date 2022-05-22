import { fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AsiManageCollaboratorsModule,
  CollaboratorsDialogService,
} from '@asi/collaborators/ui/feature-core';
import { dataCySelector } from '@cosmos/testing';
import { HasRolePipe, IsOwnerPipe } from '@esp/auth';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { ProjectCloseDialogResult } from '../../dialogs/project-close/models/dialog.model';
import { ProjectsDialogService } from '../../services';
import { ProjectDetailLocalState } from './project-detail.local-state';
import {
  ProjectDetailPage,
  ProjectDetailPageModule,
} from './project-detail.page';

const selectors = {
  title: dataCySelector('title'),
  eventPill: dataCySelector('event-pill'),
  customerName: dataCySelector('customer-name'),
  createdLabel: dataCySelector('created-label'),
  createdDate: dataCySelector('created-date'),
  ownerLabel: dataCySelector('owner-label'),
  ownerName: dataCySelector('owner-name'),
  inHandsLabel: dataCySelector('in-hands-label'),
  inHandsDate: dataCySelector('in-hands-date'),
  actionsMenu: dataCySelector('actions-menu'),
  transferOwnershipButton: dataCySelector('transfer-ownership-button'),
  projectMenu: dataCySelector('project-menu'),
};

const mockedProject = {
  Customer: {
    Id: 1,
    Name: 'Test name',
  },
  Id: 1,
  IsActive: true,
  IsEditable: true,
  Name: 'Test project',
  EventType: 'Celebration',
  CreateDate: new Date(2014, 11, 16),
  OwnerId: 123,
  Owner: {
    Name: 'Test Owner',
  },
} as any;

const createComponent = createComponentFactory({
  component: ProjectDetailPage,
  imports: [
    RouterTestingModule,
    ProjectDetailPageModule,
    NgxsModule.forRoot(),
    AsiManageCollaboratorsModule,
  ],
});

const testSetup = (project?, isAdmin?, isOwner?) => {
  const spectator = createComponent({
    providers: [
      mockProvider(ProjectDetailLocalState, {
        connect() {
          return of(this);
        },
        project: project || mockedProject,
        isLoading: false,
        hasLoaded: true,
        closeProject: (project) => EMPTY,
        reopenProject: (project) => EMPTY,
        transferOwnership: (project, userId) => EMPTY,
        updateRecents: () => EMPTY,
      }),
      mockProvider(CollaboratorsDialogService),
      mockProvider(ProjectsDialogService),
      mockProvider(HasRolePipe, {
        transform: () => isAdmin ?? false,
      }),
      mockProvider(IsOwnerPipe, {
        transform: () => isOwner ?? false,
      }),
    ],
  });

  return {
    spectator: spectator,
    component: spectator.component,
  };
};

describe('ProjectDetailPage', () => {
  it('should create', () => {
    const { spectator } = testSetup();
    expect(spectator).toBeTruthy();
  });

  it('should display 3-dot menu when project is editable', () => {
    const { spectator } = testSetup({ ...mockedProject, IsEditable: true });
    expect(spectator.query(selectors.projectMenu)).toBeTruthy();
  });

  it('should display reopen button when project StatusName is `Closed`', () => {
    const { spectator } = testSetup({ ...mockedProject, StatusName: 'Closed' });

    expect(spectator.query(selectors.projectMenu)).toBeFalsy();
    expect(
      spectator
        .query('.project-detail-header__reopen-button')
        .textContent.trim()
    ).toEqual('Reopen Project');
  });

  it('should display project title', () => {
    assertFieldHasText(selectors.title, mockedProject.Name);
  });

  it('should display event pill with project event', () => {
    assertFieldHasText(selectors.eventPill, mockedProject.EventType);
  });

  it('should display customer name', () => {
    assertFieldHasText(selectors.customerName, mockedProject.Customer.Name);
  });

  it('should display customer name', () => {
    assertFieldHasText(selectors.customerName, mockedProject.Customer.Name);
  });

  it('should display `Created on` label and creation date', () => {
    assertFieldHasText(selectors.createdLabel, 'Created on');
  });

  it('should display creation date', () => {
    assertFieldHasText(selectors.createdDate, 'December 16, 2014');
  });

  it('should display `Owned by` label', () => {
    assertFieldHasText(selectors.ownerLabel, 'Owned by');
  });

  it('should display owner name', () => {
    assertFieldHasText(selectors.ownerName, mockedProject.Owner.Name);
  });

  describe('InHands date', () => {
    it('Should display project In-Hands Date', () => {
      const { spectator } = testSetup({
        ...mockedProject,
        InHandsDate: new Date(2016, 11, 16).toString(),
      });

      spectator.detectChanges();

      expect(spectator.query(selectors.inHandsDate).textContent.trim()).toEqual(
        'December 16, 2016'
      );
    });

    it('Should display `-`', () => {
      const { spectator } = testSetup({
        ...mockedProject,
        InHandsDate: null,
      });

      spectator.detectChanges();

      expect(spectator.query(selectors.inHandsDate).textContent.trim()).toEqual(
        '-'
      );
    });

    it('Should display In-Hands Date label', () => {
      const { spectator } = testSetup();

      spectator.detectChanges();

      expect(
        spectator.query(selectors.inHandsLabel).textContent.trim()
      ).toEqual('In-Hands Date');
    });
  });

  it('Should open CloseProjectDialog and dispatch ProjectActions.CloseProject action', fakeAsync(() => {
    const { spectator, component } = testSetup();

    const mockedPayload = {
      Project: mockedProject,
      Note: 'test note',
      Resolution: 'test resolution',
    } as any;

    const stateSpy = jest.spyOn(component.state, 'closeProject');
    const projectsDialogService = spectator.inject(ProjectsDialogService);
    const spyFn = jest
      .spyOn(projectsDialogService, 'openCloseProjectDialog')
      .mockReturnValue(
        of(<ProjectCloseDialogResult>{
          Note: mockedPayload.Note,
          Resolution: mockedPayload.Resolution,
        })
      );

    component.onCloseProject();
    spectator.tick();

    expect(spyFn).toHaveBeenCalled();
    expect(stateSpy).toHaveBeenCalled();
  }));

  it('Should dispatch ProjectActions.ReopenProject', () => {
    const { component } = testSetup();

    const stateSpy = jest.spyOn(component.state, 'reopenProject');

    component.onReopenProject();

    expect(stateSpy).toHaveBeenCalled();
  });

  describe('Transfer ownership', () => {
    it('Should hide transfer ownership button for user who is not owner of the project nor admin', () => {
      const { spectator } = testSetup(
        {
          ...mockedProject,
          IsEditable: true,
        },
        false,
        false
      );

      const actionsMenu = spectator.query(selectors.actionsMenu);

      spectator.click(actionsMenu);

      spectator.detectChanges();

      expect(spectator.query(selectors.transferOwnershipButton)).toBeFalsy();
    });

    it('Should show transfer ownership button for user who is owner of the project', () => {
      const { spectator } = testSetup(
        {
          ...mockedProject,
          IsEditable: true,
          OwnerId: 123,
        },
        false,
        true
      );

      const actionMenu = spectator.query(selectors.actionsMenu);

      spectator.click(actionMenu);

      spectator.detectChanges();

      expect(spectator.query(selectors.transferOwnershipButton)).toExist();
    });

    it('Should show transfer ownership button for admin', () => {
      const { spectator } = testSetup(
        {
          ...mockedProject,
          IsEditable: true,
        },
        true,
        false
      );

      const actionMenu = spectator.query(selectors.actionsMenu);

      spectator.click(actionMenu);

      spectator.detectChanges();

      expect(spectator.query(selectors.transferOwnershipButton)).toExist();
    });

    it('Should open transfer ownership dialog and call state.transferOwnership on success', fakeAsync(() => {
      const { spectator, component } = testSetup();

      const collaboratorsDialogService = spectator.inject(
        CollaboratorsDialogService
      );
      const spyFn = jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(<any>{ Id: 10000 }));

      const spyStateTransferOwnership = jest
        .spyOn(component.state, 'transferOwnership')
        .mockReturnValue(of(<any>{ Id: 10000 }));

      component.onTransferOwnership();
      spectator.tick();

      expect(spyFn).toHaveBeenCalledWith({
        entity: mockedProject,
      });
      expect(spyStateTransferOwnership).toHaveBeenCalled();
    }));

    it('Should open transfer ownership dialog and call state.transferOwnership when Id <= 0', () => {
      const { spectator, component } = testSetup();

      const collaboratorsDialogService = spectator.inject(
        CollaboratorsDialogService
      );
      const spyFn = jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(<any>{ Id: 0 }));

      const spyStateTransferOwnership = jest
        .spyOn(component.state, 'transferOwnership')
        .mockReturnValue(of(<any>{ Id: 10000 }));

      component.onTransferOwnership();

      expect(spyFn).toHaveBeenCalledWith({
        entity: mockedProject,
      });
      expect(spyStateTransferOwnership).not.toHaveBeenCalled();
    });
  });
});

function assertFieldHasText(selector: string, expectedText: string): void {
  const { spectator } = testSetup();
  const label = spectator.query(selector).textContent.trim();
  expect(label).toEqual(expectedText);
}
