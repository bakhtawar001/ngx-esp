import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { dataCySelector } from '@cosmos/testing';
import { Project } from '@esp/models';
import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  ProjectDetailsCardComponent,
  ProjectDetailsCardModule,
} from './project-details-card.component';

const testData = {
  card: dataCySelector('card'),
  icon: dataCySelector('icon'),
  title: dataCySelector('title'),
  customerName: dataCySelector('customer-name'),
  detailsButton: dataCySelector('details-button'),
  details: dataCySelector('details'),
  transferOwnership: dataCySelector('transfer-ownership'),
  inHandsDate: dataCySelector('in-hands-date'),
  inHandsDateLabel: dataCySelector('in-hands-date-label'),
  dealValue: dataCySelector('deal-value'),
  dealValueLabel: dataCySelector('deal-value-label'),
  ownerAvatar: dataCySelector('owner-avatar'),
  ownerAvatarWithInitials: '[data-cy=owner-avatar-with-initials]',
  ownerInfo: dataCySelector('owner-info'),
  createDate: dataCySelector('create-date'),
  closeProjectButton: dataCySelector('close-project-button'),
  reopenProjectButton: dataCySelector('reopen-project-button'),
};

const mockedProject = {
  Id: 1,
  Customer: {
    Id: 1,
    Name: 'Customer 1',
    IconImageUrl: 'testUrl',
  },
  Name: 'Project 3',
  StepName: 'Negotiating & Pitching',
  IsActive: true,
  IsEditable: true,
  Owner: {},
} as any;

const createComponent = createComponentFactory({
  component: ProjectDetailsCardComponent,
  imports: [ProjectDetailsCardModule, RouterTestingModule],
  declarations: [ProjectDetailsCardComponent],
});

const testSetup = (options?: {
  project?: Partial<Project>;
  IsEditable?: boolean;
}) => {
  const spectator = createComponent({ detectChanges: false });
  const component = spectator.component;
  let project = options?.project ?? mockedProject;

  if (options?.IsEditable !== undefined) {
    project = { ...project, IsEditable: options.IsEditable };
  }

  component.project = project;
  component.detailShown = true;

  spectator.detectChanges();

  return {
    spectator,
    component,
  };
};

describe('ProjectDetailsCardComponent', () => {
  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Top border color', () => {
    it('should have top-border color set to customer PrimaryBrandColor', () => {
      const mockedColor = '#ffffff';
      const { spectator } = testSetup({
        project: {
          ...mockedProject,
          Customer: {
            ...mockedProject.Customer,
            PrimaryBrandColor: mockedColor,
          },
        },
      });

      spectator.detectChanges();

      const card = spectator.debugElement.query(By.css(testData.card));
      expect(card.nativeElement.style.borderTopColor).toEqual(mockedColor);
    });

    it('should have top-border color set to #6A7281', () => {
      const { spectator } = testSetup();

      spectator.detectChanges();

      const card = spectator.debugElement.query(By.css(testData.card));
      expect(card.nativeElement.style.borderTopColor).toEqual('#6A7281');
    });
  });

  it('should display title', () => {
    const { spectator } = testSetup();

    spectator.detectChanges();

    expect(spectator.query(testData.title).textContent.trim()).toEqual(
      mockedProject.Name
    );
  });

  it('should display customer name', () => {
    const { spectator } = testSetup();

    spectator.detectChanges();

    expect(spectator.query(testData.customerName).textContent.trim()).toEqual(
      mockedProject.Customer.Name
    );
  });

  describe('Card menu', () => {
    it('should display buttons: Follow, Set Reminder, Transfer Ownership, Close', fakeAsync(() => {
      const { spectator } = testSetup({ IsEditable: true });
      const actionsBtn = spectator.query('.mat-menu-trigger');

      spectator.click(actionsBtn);
      spectator.tick(200);

      const menu = spectator.query('.mat-menu-content');

      expect(menu.children[0]).toHaveText('Follow');
      expect(menu.children[1]).toHaveText('Set Reminder');
      expect(menu.children[2]).toHaveText('Transfer Ownership');
      expect(menu.children[3]).toHaveText('Close');
    }));

    it('should display buttons: Follow, Set Reminder, Transfer Ownership, Close', fakeAsync(() => {
      const { spectator } = testSetup({
        project: {
          ...mockedProject,
          StepName: 'Closed',
        },
        IsEditable: true,
      });
      const actionsBtn = spectator.query('.mat-menu-trigger');

      spectator.click(actionsBtn);
      spectator.tick(200);

      const menu = spectator.query('.mat-menu-content');

      expect(menu.children[0]).toHaveText('Follow');
      expect(menu.children[1]).toHaveText('Set Reminder');
      expect(menu.children[2]).toHaveText('Transfer Ownership');
      expect(menu.children[3]).toHaveText('Reopen Project');
    }));

    it('should not display menu when project is not editable', () => {
      const { spectator } = testSetup({ IsEditable: false });
      const actionsBtn = spectator.query('.mat-menu-trigger');
      expect(actionsBtn).not.toExist();

      const menu = spectator.query('.mat-menu-content');
      expect(menu).not.toExist();
    });

    it('Should emit transferOwnership on click transfer ownership button', () => {
      const { spectator, component } = testSetup({ IsEditable: true });
      const spyOnTransferOwnership = jest.spyOn(
        component,
        'onTransferOwnership'
      );
      const spyOnEmittingTransferOwnership = jest.spyOn(
        component.transferOwnership,
        'emit'
      );

      const actionsBtn = spectator.query('.mat-menu-trigger');
      spectator.click(actionsBtn);

      spectator.click(testData.transferOwnership);
      expect(spyOnTransferOwnership).toHaveBeenCalled();
      expect(spyOnEmittingTransferOwnership).toHaveBeenCalled();
    });
  });

  it('should hide 3-dot menu for project that is not editable', fakeAsync(() => {
    const { spectator } = testSetup({ ...mockedProject, IsEditable: false });

    expect(spectator.query('.mat-menu-trigger')).toBeFalsy();
  }));

  describe('Project expanded details', () => {
    it('Should toggle project details on details button click', fakeAsync(() => {
      const { spectator, component } = testSetup();
      component.detailShown = false;

      spectator.detectChanges();

      let detailsButton = spectator.query(testData.detailsButton);

      spectator.click(detailsButton);
      spectator.tick(200);

      expect(component.detailShown).toBeTruthy();
      expect(spectator.query(testData.details)).toBeTruthy();

      detailsButton = spectator.query(testData.detailsButton);

      spectator.click(detailsButton);
      spectator.tick(200);

      expect(component.detailShown).toBeFalsy();
      expect(spectator.query(testData.details)).toBeFalsy();
    }));

    describe('InHands date', () => {
      it('Should display project In-Hands Date', fakeAsync(() => {
        const { spectator } = testSetup({
          project: {
            ...mockedProject,
            InHandsDate: new Date(2016, 11, 16, 1, 1, 1).toString(),
          },
        });

        expect(
          spectator.query(testData.inHandsDate).textContent.trim()
        ).toEqual('Dec 16, 2016');
      }));

      it('Should display `-` In-Hands Date', fakeAsync(() => {
        const { spectator } = testSetup({
          project: {
            ...mockedProject,
            InHandsDate: null,
          },
        });

        expect(
          spectator.query(testData.inHandsDate).textContent.trim()
        ).toEqual('-');
      }));

      it('Should display In-Hands Date label', fakeAsync(() => {
        const { spectator } = testSetup();

        expect(
          spectator.query(testData.inHandsDateLabel).textContent.trim()
        ).toEqual('In-Hands Date');
      }));
    });

    describe('Deal Value', () => {
      it('Should display budget as Deal Value', () => {
        const { spectator } = testSetup({
          project: {
            ...mockedProject,
            Budget: 1000.55,
          },
        });

        expect(spectator.query(testData.dealValue).textContent.trim()).toEqual(
          '$1,000.55'
        );
      });

      it('Should display `-` when no budget is provided', () => {
        const { spectator } = testSetup();

        expect(spectator.query(testData.dealValue).textContent.trim()).toEqual(
          '-'
        );
      });

      it('Should display Deal Value label', fakeAsync(() => {
        const { spectator } = testSetup();

        expect(
          spectator.query(testData.dealValueLabel).textContent.trim()
        ).toEqual('Deal Value');
      }));
    });

    describe('Owner details', () => {
      it('Should display project owner avatar', fakeAsync(() => {
        const { spectator } = testSetup({
          project: {
            ...mockedProject,
            Owner: {
              IconImageUrl: 'testUrl',
            },
          },
        });

        expect(spectator.query(testData.ownerAvatar)).toExist();
        expect(
          spectator.query(testData.ownerAvatar).getAttribute('src')
        ).toEqual('testUrl');
      }));

      it('Should display project owner name with label `Managed by`', fakeAsync(() => {
        const { spectator } = testSetup({
          project: {
            ...mockedProject,
            Owner: {
              Name: 'Test Owner',
            },
          },
        });

        const info = spectator.query(testData.ownerInfo);

        expect(info.children[0].textContent.trim()).toEqual('Managed by');
        expect(info.children[1].textContent.trim()).toEqual('Test Owner');
      }));

      it('Should display owner initials when no avatar available', () => {
        const { spectator } = testSetup({
          project: {
            ...mockedProject,
            Owner: {
              Name: 'As Das',
              IconImageUrl: null,
            },
          },
        });

        expect(spectator.query(testData.ownerAvatarWithInitials)).toExist();
        expect(
          spectator.query(testData.ownerAvatarWithInitials).textContent.trim()
        ).toEqual('AD');
      });
    });

    it('Should display CreateDate with label `Created Date:`', fakeAsync(() => {
      const { spectator } = testSetup({
        project: {
          ...mockedProject,
          CreateDate: new Date(2016, 11, 16, 1, 1, 1).toString(),
        },
      });

      expect(spectator.query(testData.createDate).textContent.trim()).toEqual(
        'Created Date: Dec 16, 2016'
      );
    }));
  });

  it('Should emit closeProject on click closeProject button', () => {
    const { spectator, component } = testSetup({
      project: {
        ...mockedProject,
        StepName: 'Processing',
      },
    });

    const spyClose = jest.spyOn(component, 'onCloseProject');
    const spyCloseEmit = jest.spyOn(component.closeProject, 'emit');
    const actionsBtn = spectator.query('.mat-menu-trigger');

    spectator.click(actionsBtn);
    spectator.click(testData.closeProjectButton);

    expect(spyClose).toHaveBeenCalled();
    expect(spyCloseEmit).toHaveBeenCalled();
  });

  it('Should emit reopenProject on click reopenProject button', () => {
    const { spectator, component } = testSetup({
      project: {
        ...mockedProject,
        StepName: 'Closed',
      },
      IsEditable: true,
    });

    const spyReopen = jest.spyOn(component, 'onReopenProject');
    const spyReopenEmit = jest.spyOn(component.reopenProject, 'emit');
    const actionsBtn = spectator.query('.mat-menu-trigger');

    spectator.click(actionsBtn);
    spectator.click(testData.reopenProjectButton);

    expect(spyReopen).toHaveBeenCalled();
    expect(spyReopenEmit).toHaveBeenCalled();
  });
});
