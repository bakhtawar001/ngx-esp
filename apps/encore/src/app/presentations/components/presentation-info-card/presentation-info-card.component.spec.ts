import { DatePipe } from '@angular/common';
import { Presentation, PresentationStatus, Project } from '@esp/models';
import { PresentationMockDb } from '@esp/__mocks__/presentations';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ProjectsDialogService } from '../../../projects/services';
import { PresentationLocalState } from '../../local-states';
import {
  PresentationInfoCardComponent,
  PresentationInfoCardComponentModule,
} from './presentation-info-card.component';

const presentation = PresentationMockDb.presentation;
const project = {
  Id: 500000362,
  Name: 'test presentation ravi1',
  Customer: { PrimaryBrandColor: '#6A7281 ', Id: 500163495, Name: 'bcvbcv' },
  InHandsDate: '2021-11-04T18:30:00',
  EventDate: '2021-11-24T18:30:00',
  EventType: 'Advertising',
  Budget: 1000.0,
  CurrencyTypeCode: 'USD',
  NumberOfAssignees: 10,
  Contacts: [],
  StatusStep: 0,
  StatusName: 'Negotiating and Pitching',
  CreateDate: '2021-11-05T05:28:02.07',
  TenantId: 5907,
  OwnerId: 941,
  AccessLevel: 'Everyone',
  Access: [{ AccessLevel: 'Everyone', EntityId: 0, AccessType: 'ReadWrite' }],
  IsVisible: true,
  IsEditable: true,
  Collaborators: [
    { Id: 941, Name: 'Leigh Penny', IsTeam: false, Role: 'Owner' },
  ],
};

describe('PresentationInfoCardComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationInfoCardComponent,
    imports: [PresentationInfoCardComponentModule],
    providers: [
      mockProvider(Store, { select: (selector) => of('test') }),
      mockProvider(ProjectsDialogService, {
        openProjectEditInfoDialog: () => of({} as any),
      }),
    ],
  });

  const testSetup = (options?: {
    presentation?: Presentation;
    project?: Project;
    isLoading?: boolean;
    hasLoaded?: boolean;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(PresentationLocalState, {
          presentation,
          project,
          isLoading: options?.isLoading ?? false,
          hasLoaded: options?.hasLoaded ?? true,
          connect() {
            return of(this);
          },
        }),
      ],
    });
    return {
      spectator,
      component: spectator.component,
    };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it("should should show the page header as 'Presentation information'", () => {
    // Arrange
    const { spectator } = testSetup();
    const pageHeader = spectator.query('.header-style-14-bold');

    // Assert
    expect(pageHeader).toExist();
    expect(pageHeader).toHaveText('Presentation information');
  });

  it("should show Shared With info when shared with a cutomer along with the Date along with text 'Presentation has not been viewed yet.'", () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.state.presentation.Status = 'PostShare' as PresentationStatus;
    component.state.presentation.SharedDate = new Date(
      2020,
      0,
      1,
      12,
      0,
      0,
      0
    ).toString();
    spectator.detectComponentChanges();
    const shareDetailsSection = spectator.query('p.header-style-16-bold');
    const datePipe = new DatePipe('en-US');

    // Assert
    expect(shareDetailsSection).toExist();
    expect(shareDetailsSection).toHaveText(
      `Shared with ${
        component.state.presentation.Customer.Name
      } on ${datePipe.transform(
        component.state.presentation.SharedDate,
        'longDate'
      )}.`
    );
    expect(shareDetailsSection).toContainText(
      'Presentation has not been viewed yet.'
    );
  });

  it('should display the Expiration date for a customer, if present', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.state.presentation.Status = 'PostShare' as PresentationStatus;
    component.state.presentation.ExpirationDate = new Date(
      2020,
      0,
      1,
      12,
      0,
      0,
      0
    ).toString();
    spectator.detectComponentChanges();
    const shareDetailsSection = spectator.query('p.header-style-16-bold');
    const datePipe = new DatePipe('en-US');

    // Assert
    expect(shareDetailsSection).toExist();
    expect(shareDetailsSection).toContainText(
      `Link expires ${datePipe.transform(
        component.state.presentation.ExpirationDate,
        'longDate'
      )}`
    );
  });

  it("should display the message 'This presentation has not been shared with the Customer yet.', when PreShare tab is selected", () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.state.presentation.Status = 'PreShare' as PresentationStatus;
    spectator.detectComponentChanges();
    const shareMsg = spectator.query('.header-style-16');

    // Assert
    expect(shareMsg).toExist();
    expect(shareMsg).toHaveText(
      'This presentation has not been shared with the Customer yet.'
    );
  });

  it("should display the header 'Customer Engagement'", () => {
    // Arrange
    const { spectator } = testSetup();
    const customerEngagementHeader = spectator.query(
      '.header-style-14-bold.mt-32.mb-8'
    );

    // Assert
    expect(customerEngagementHeader).toExist();
    expect(customerEngagementHeader).toHaveText('Customer Engagement');
  });

  it("should display the header 'Last Viewed'", () => {
    // Arrange
    const { spectator } = testSetup();
    const lastViewedHeader = spectator.queryAll('.header-style-12')[0];

    // Assert
    expect(lastViewedHeader).toExist();
    expect(lastViewedHeader).toHaveText('Last Viewed');
  });

  it('should display the Last Viewed date, if present', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.state.presentation.LastViewDate = new Date(
      2020,
      0,
      1,
      12,
      0,
      0,
      0
    ).toString();
    spectator.detectComponentChanges();
    const lastViewedDate = spectator.queryAll('.header-style-14-bold')[2];

    // Assert
    expect(lastViewedDate).toExist();
    expect(lastViewedDate).toHaveText(
      component.state.presentation.LastViewDate
    );
  });

  it("should display the text 'Not Viewed', if view date is not present", () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.state.presentation.LastViewDate = null;
    spectator.detectComponentChanges();
    const lastViewedDate = spectator.queryAll('.header-style-14-bold')[2];

    // Assert
    expect(lastViewedDate).toExist();
    expect(lastViewedDate).toHaveText('Not Viewed');
  });

  it("should display the header 'Quotes requested'", () => {
    // Arrange
    const { spectator } = testSetup();
    const quoteHeader = spectator.queryAll('.header-style-12')[1];

    // Assert
    expect(quoteHeader).toExist();
    expect(quoteHeader).toHaveText('Quotes requested');
  });

  it('should display the number of products quoted', () => {
    // Arrange
    const { spectator, component } = testSetup();
    component.state.presentation.NumberOfProductsQuoted = 2;
    spectator.detectComponentChanges();

    const noOfprodQuoted = spectator.queryAll('.proj-pres__metric')[0];
    // Assert
    expect(noOfprodQuoted).toExist();
    expect(noOfprodQuoted).toHaveText('2');
  });

  it("should display the header 'Products disliked'", () => {
    // Arrange
    const { spectator, component } = testSetup();
    const prodsDislikedHeader = spectator.queryAll('.header-style-12')[2];

    // Assert
    expect(prodsDislikedHeader).toExist();
    expect(prodsDislikedHeader).toHaveText('Products disliked');
  });

  it('should display the number of products disliked', () => {
    // Arrange
    const { spectator, component } = testSetup();
    component.state.presentation.NumberOfProductsDisliked = 3;
    spectator.detectComponentChanges();

    const noOfProdsDisliked = spectator.queryAll('.proj-pres__metric')[1];

    // Assert
    expect(noOfProdsDisliked).toExist();
    expect(noOfProdsDisliked).toHaveText('3');
  });

  it('should display the Project Details section on the right', () => {
    // Arrange
    const { spectator } = testSetup();
    const projectDetailsSection =
      spectator.query('div.cos-card-body').children[1];

    // Assert
    expect(projectDetailsSection).toExist();
  });

  it("should display the project details section header as 'Project Details'", () => {
    // Arrange
    const { spectator } = testSetup();
    const projectDetailsSectionHeader =
      spectator.query('div.cos-card-body').children[1].children[0];

    // Assert
    expect(projectDetailsSectionHeader).toExist();
    expect(projectDetailsSectionHeader).toHaveText('Project Details');
  });

  describe('Project Details content', () => {
    it("should display project Create Date detail, correctly with text 'Project created on (create_date)'", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const projectCreateDateDetail = spectator.queryAll(
        '.project-info-grid > li'
      )[0];
      const projectCreateDateDetailIcon = spectator.queryAll(
        '.project-info-grid > li > i'
      )[0];
      const datePipe = new DatePipe('en-US');

      // Assert
      expect(projectCreateDateDetail).toBeVisible();
      expect(projectCreateDateDetailIcon).toHaveClass('fa fa-user-clock');
      expect(projectCreateDateDetail).toHaveDescendant(
        projectCreateDateDetailIcon
      );
      expect(projectCreateDateDetail).toHaveText(
        `Project created on ${datePipe.transform(
          component.state.project.CreateDate,
          'longDate'
        )}`
      );
    });

    it("should display project Needed in-hands detail, correctly with text 'Needed in-hands by (inHands_date)'", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const projectInHandsDateDetail = spectator.queryAll(
        '.project-info-grid > li'
      )[1];
      const projectInHandsDateDetailIcon = spectator.queryAll(
        '.project-info-grid > li > i'
      )[1];
      const datePipe = new DatePipe('en-US');

      // Assert
      expect(projectInHandsDateDetail).toBeVisible();
      expect(projectInHandsDateDetailIcon).toHaveClass('fa fa-hand-paper');
      expect(projectInHandsDateDetail).toHaveDescendant(
        projectInHandsDateDetailIcon
      );
      expect(projectInHandsDateDetail).toHaveText(
        `Needed in-hands by ${datePipe.transform(
          component.state.project.InHandsDate,
          'longDate'
        )}`
      );
    });

    it("should display project Event Scheduled detail, correctly with text 'Event scheduled for (event_date)'", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const projectEventDateDetail = spectator.queryAll(
        '.project-info-grid > li'
      )[2];
      const projectEventDateDetailIcon = spectator.queryAll(
        '.project-info-grid > li > i'
      )[2];
      const datePipe = new DatePipe('en-US');

      // Assert
      expect(projectEventDateDetail).toBeVisible();
      expect(projectEventDateDetailIcon).toHaveClass('fa fa-calendar-alt');
      expect(projectEventDateDetail).toHaveDescendant(
        projectEventDateDetailIcon
      );
      expect(projectEventDateDetail).toHaveText(
        `Event scheduled for ${datePipe.transform(
          component.state.project.EventDate,
          'longDate'
        )}`
      );
    });

    it("should display project Event Type detail, correctly with text '(event_type)'", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const projectEventTypeDetail = spectator.queryAll(
        '.project-info-grid > li'
      )[3];
      const projectEventTypeDetailIcon = spectator.queryAll(
        '.project-info-grid > li > i'
      )[3];

      // Assert
      expect(projectEventTypeDetail).toBeVisible();
      expect(projectEventTypeDetailIcon).toHaveClass('fa fa-calendar-week');
      expect(projectEventTypeDetail).toHaveDescendant(
        projectEventTypeDetailIcon
      );
      expect(projectEventTypeDetail).toHaveText(
        `${component.state.project.EventType}`
      );
    });

    it("should display project Budget detail, correctly with text 'Budget of (budget)'", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const projectBudgetDetail = spectator.queryAll(
        '.project-info-grid > li'
      )[4];
      const projectBudgetDetailIcon = spectator.queryAll(
        '.project-info-grid > li > i'
      )[4];

      // Assert
      expect(projectBudgetDetail).toBeVisible();
      expect(projectBudgetDetailIcon).toHaveClass('fa fa-money-check-alt');
      expect(projectBudgetDetail).toHaveDescendant(projectBudgetDetailIcon);
      expect(projectBudgetDetail).toHaveText(
        `Budget of ${component.state.project.Budget}`
      );
    });

    it("should display project Attendees detail, correctly with text '(no_of_attendees) attendees'", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const projectAttendeesDetail = spectator.queryAll(
        '.project-info-grid > li'
      )[5];
      const projectAttendeesDetailIcon = spectator.queryAll(
        '.project-info-grid > li > i'
      )[5];

      // Assert
      expect(projectAttendeesDetail).toBeVisible();
      expect(projectAttendeesDetailIcon).toHaveClass('fa fa-users');
      expect(projectAttendeesDetail).toHaveDescendant(
        projectAttendeesDetailIcon
      );
      expect(projectAttendeesDetail).toHaveText(
        `${component.state.project.NumberOfAssignees} attendees`
      );
    });
    it("should show '-' for InHands Date, Event Scheduled Date, Budget Amount, Project Event Type, Project Attendees Detail", () => {
      const { component, spectator } = testSetup();

      component.state.project = {
        ...component.state.project,
        InHandsDate: undefined,
        EventDate: undefined,
        EventType: undefined,
        Budget: undefined,
        NumberOfAssignees: 0,
      };
      spectator.detectComponentChanges();
      const projectDetailDivs = spectator.queryAll('.project-info-grid > li');

      projectDetailDivs.forEach((detail, i) => {
        // skipping for project created Date where i = 0
        if (i > 0) {
          expect(detail).toHaveText('-');
        }
      });
    });
  });
});
