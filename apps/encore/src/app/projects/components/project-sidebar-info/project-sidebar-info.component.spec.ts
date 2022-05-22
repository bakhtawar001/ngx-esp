import { DatePipe } from '@angular/common';
import { dataCySelector } from '@cosmos/testing';
import { Project } from '@esp/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { ProjectsDialogService } from '../../services';
import {
  ProjectSidebarInfoComponent,
  ProjectSidebarInfoModule,
} from './project-sidebar-info.component';

const header = {
  label: '.project-info__header h3',
  editButton: '.project-info__header button',
  editButtonIcon: '.project-info__header button i',
};
const fields = {
  createdOn: dataCySelector('project-created-on'),
  inHandsDate: dataCySelector('project-in-hands-date'),
  eventDate: dataCySelector('project-event-date'),
  budget: dataCySelector('project-budget'),
  eventType: dataCySelector('project-event-type'),
  attendees: dataCySelector('project-attendees'),
};

let spectator: Spectator<ProjectSidebarInfoComponent>;
let component: ProjectSidebarInfoComponent;

const createComponent = createComponentFactory({
  component: ProjectSidebarInfoComponent,
  imports: [ProjectSidebarInfoModule],
  providers: [
    DatePipe,
    MockProvider(ProjectsDialogService, {
      openProjectEditInfoDialog: () => of({} as any),
    }),
  ],
});

const testSetup = (options?: Partial<Project>) => {
  spectator = createComponent({
    props: {
      project: options !== undefined ? options : ({ IsEditable: true } as any),
    },
  });
  component = spectator.component;

  return { component, spectator };
};

describe('ProjectSidebarInfoComponent', () => {
  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  describe('Header', () => {
    it('should display group title', () => {
      const { spectator } = testSetup();

      expect(spectator.query(header.label)).toBeTruthy();
      expect(spectator.query(header.label).textContent.trim()).toEqual(
        'Project Information'
      );
    });

    it('should display edit pencil', () => {
      const { spectator } = testSetup();

      expect(spectator.query(header.editButton)).toBeTruthy();
      expect(spectator.query(header.editButtonIcon)).toBeTruthy();
      expect(spectator.query(header.editButtonIcon).classList).toContain(
        'fa-pen'
      );
    });

    it('should open edit dialog when clicking on pencil icon', () => {
      const { spectator } = testSetup();
      const dialogService = spectator.inject(ProjectsDialogService, true);
      jest.spyOn(dialogService, 'openProjectEditInfoDialog');

      spectator.click(header.editButton);

      expect(dialogService.openProjectEditInfoDialog).toHaveBeenCalled();
    });

    it('should hide edit icon when project is not editable', () => {
      const { spectator } = testSetup({ IsEditable: false });

      expect(spectator.query(header.editButtonIcon)).toBeFalsy();
    });
  });

  describe('Created on', () => {
    it('should display date when present', () => {
      const { spectator } = testSetup({ CreateDate: new Date(2021, 10, 11) });

      expect(spectator.query(fields.createdOn).textContent.trim()).toEqual(
        'Project created on November 11, 2021'
      );
    });

    it('should display empty sign when not present', () => {
      const { spectator } = testSetup();

      expect(spectator.query(fields.createdOn).textContent.trim()).toEqual(
        'Project created on -'
      );
    });
  });

  describe('In-Hands date', () => {
    it('should display date when present', () => {
      const { spectator } = testSetup({ InHandsDate: new Date(2021, 10, 11) });

      expect(spectator.query(fields.inHandsDate).textContent.trim()).toEqual(
        'Needed in-hands by November 11, 2021'
      );
    });

    it('should display empty sign when not present', () => {
      const { spectator } = testSetup();

      expect(spectator.query(fields.inHandsDate).textContent.trim()).toEqual(
        'Needed in-hands by -'
      );
    });
  });

  describe('Event date', () => {
    it('should display date when present', () => {
      const { spectator } = testSetup({ EventDate: new Date(2021, 10, 11) });

      expect(spectator.query(fields.eventDate).textContent.trim()).toEqual(
        'Event scheduled for November 11, 2021'
      );
    });

    it('should display empty sign when not present', () => {
      const { spectator } = testSetup();

      expect(spectator.query(fields.eventDate).textContent.trim()).toEqual(
        'Event scheduled for -'
      );
    });
  });

  describe('Budget', () => {
    it('should display value when present', () => {
      const { spectator } = testSetup({ Budget: 1000 });

      expect(spectator.query(fields.budget).textContent.trim()).toEqual(
        'Budget of $1,000.00'
      );
    });

    it('should display empty sign when not present', () => {
      const { spectator } = testSetup();

      expect(spectator.query(fields.budget).textContent.trim()).toEqual(
        'Budget of -'
      );
    });

    it('should display empty sign when budget is 0', () => {
      const { spectator } = testSetup({ Budget: 0 });

      expect(spectator.query(fields.budget).textContent.trim()).toEqual(
        'Budget of -'
      );
    });
  });

  describe('Event type', () => {
    it('should display value when present', () => {
      const { spectator } = testSetup({ EventType: 'test' });

      expect(spectator.query(fields.eventType).textContent.trim()).toEqual(
        'Event type test'
      );
    });

    it('should display empty sign when not present', () => {
      const { spectator } = testSetup();

      expect(spectator.query(fields.eventType).textContent.trim()).toEqual(
        'Event type -'
      );
    });
  });

  describe('Attendees', () => {
    it('should display value when present', () => {
      const { spectator } = testSetup({ NumberOfAssignees: 5 });

      expect(spectator.query(fields.attendees).textContent.trim()).toEqual(
        'Attendees 5'
      );
    });

    it('should display empty sign when not present', () => {
      const { spectator } = testSetup();

      expect(spectator.query(fields.attendees).textContent.trim()).toEqual(
        'Attendees -'
      );
    });

    it('should display empty sign when budget is 0', () => {
      const { spectator } = testSetup({ Budget: 0 });

      expect(spectator.query(fields.attendees).textContent.trim()).toEqual(
        'Attendees -'
      );
    });
  });
});
