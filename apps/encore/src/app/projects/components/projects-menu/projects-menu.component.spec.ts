import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AsiCompanyAvatarComponent,
  AsiCompanyAvatarModule,
} from '@asi/company/ui/feature-components';
import { dataCySelector } from '@cosmos/testing';
import { Project } from '@esp/models';
import { createComponentFactory } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { OrderSearchPage } from '../../../orders/pages';
import { PresentationSearchPage } from '../../../presentations/pages';
import { ProjectSearchPage } from '../../pages';
import {
  ProjectsMenuComponent,
  ProjectsMenuComponentModule,
} from './projects-menu.component';
import { ProjectsMenuLocalState } from './projects-menu.local-state';

const dialog = {
  recentHeader: '.recent-col-heading',
  notFound: dataCySelector('projects-not-found'),
  noProjectsAvailable: dataCySelector('no-projects-available'),
};

const search = {
  input: '.cos-input',
  clearIcon: '.form-field-suffix',
};

describe('ProjectsMenuComponent', () => {
  const createComponent = createComponentFactory({
    component: ProjectsMenuComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        {
          path: 'projects',
          component: ProjectSearchPage,
        },
        {
          path: 'orders',
          component: OrderSearchPage,
        },
        {
          path: 'presentations/search',
          component: PresentationSearchPage,
        },
      ]),

      ProjectsMenuComponentModule,
      NgxsModule.forRoot(),
    ],
    overrideModules: [
      [
        MatMenuModule,
        {
          set: {
            declarations: MockComponents(MatMenu),
            exports: MockComponents(MatMenu),
          },
        },
      ],
      [
        AsiCompanyAvatarModule,
        {
          set: {
            declarations: MockComponents(AsiCompanyAvatarComponent),
            exports: MockComponents(AsiCompanyAvatarComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    isLoading?: boolean;
    hasLoaded?: boolean;
    projects?: Partial<Project>[];
    term?: string;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(ProjectsMenuLocalState, {
          connect: () => EMPTY,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          search: () => {},
          criteria: { term: options?.term ? options.term : '' },
          hasLoaded:
            options?.hasLoaded !== undefined ? options.hasLoaded : true,
          isLoading:
            options?.isLoading !== undefined ? options.isLoading : false,
          projects:
            options?.projects !== undefined
              ? options.projects
              : [{ Id: 1, Customer: { Id: 123, Types: [] } }],
        }),
      ],
    });

    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  describe('Search', () => {
    it('X icon should be visible if search value was entered', fakeAsync(() => {
      // Arrange
      const { spectator } = testSetup();

      // Act
      spectator.typeInElement('test', search.input);
      spectator.tick(250);

      // Assert
      expect(spectator.query(search.clearIcon)).toBeTruthy();
    }));

    it('X icon should not be visible if search control is empty', fakeAsync(() => {
      // Arrange
      const { spectator } = testSetup();

      // Act
      spectator.typeInElement('', search.input);
      spectator.tick(250);

      // Assert
      expect(spectator.query(search.clearIcon)).toHaveProperty('hidden', true);
    }));

    it('clicking on X icon should clear search', fakeAsync(() => {
      // Arrange
      const { spectator, component } = testSetup();

      // Act
      spectator.typeInElement('test', search.input);
      spectator.tick(250);

      // Assert
      expect(component.searchControl.value).toBe('test');

      // Act again
      spectator.click(search.clearIcon);
      spectator.tick(250);

      // Re-Assert
      expect(component.searchControl.value).toBe('');
    }));

    it('should contain a watermark "Search Projects"', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(search.input)).toHaveProperty(
        'placeholder',
        'Search Projects'
      );
    });

    it('should display a label "Recent Projects" under search', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(dialog.recentHeader).textContent.trim()).toEqual(
        'Recent Projects'
      );
    });

    it('should display the 5 most recent projects', fakeAsync(() => {
      // Arrange
      const { spectator } = testSetup();
      const state = spectator.inject(ProjectsMenuLocalState, true);
      jest.spyOn(state, 'search');

      // Act
      spectator.typeInElement('test', search.input);
      spectator.tick(250);

      // Assert
      expect(state.search).toHaveBeenCalledWith({
        term: 'test',
        size: ProjectsMenuLocalState.maxProjectsCount,
        status: ProjectsMenuLocalState.projectsStatus,
      });
    }));

    it('should remove "Recent Projects" label once search is entered', () => {
      // Arrange
      const { spectator } = testSetup();

      // Act
      spectator.typeInElement('test', search.input);
      spectator.detectComponentChanges();

      // Assert
      expect(spectator.query(dialog.recentHeader)).toBeFalsy();
    });

    it('should show not found label when no projects found', () => {
      // Arrange
      const { spectator } = testSetup({
        hasLoaded: true,
        isLoading: false,
        projects: [],
        term: 'test',
      });

      // Assert
      expect(spectator.query(dialog.noProjectsAvailable)).toBeFalsy();
      expect(spectator.query(dialog.notFound)).toBeTruthy();
      expect(spectator.query(dialog.notFound).textContent.trim()).toEqual(
        'No projects found. Try changing the search term.'
      );
    });

    it('should show no projects available to view label when no projects available', () => {
      // Arrange
      const { spectator } = testSetup({
        hasLoaded: true,
        isLoading: false,
        projects: [],
      });

      // Assert
      expect(spectator.query(dialog.notFound)).toBeFalsy();
      expect(spectator.query(dialog.noProjectsAvailable)).toBeTruthy();
      expect(
        spectator.query(dialog.noProjectsAvailable).textContent.trim()
      ).toEqual(`You don't have any Projects available to view.`);
    });
  });

  it("Clicking on 'All Projects' link should take user to the projects landing page on same tab", () => {
    // Arrange
    const { spectator } = testSetup();
    const router = spectator.inject(Router);
    jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
    const allProjectsLink = spectator.query('#all-projects-link');

    // Assert
    expect(allProjectsLink.getAttribute('href')).toEqual('/projects');

    // Act
    spectator.click(allProjectsLink);
    router.navigate([allProjectsLink.getAttribute('href')]);

    // Assert
    expect(router.navigate).toHaveBeenCalledWith(['/projects']);
  });

  it("Clicking on 'All Presentations' link should take user to the presentations landing page on same tab", () => {
    // Arrange
    const { spectator } = testSetup();
    const router = spectator.inject(Router);
    jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
    const allPresentationsLink = spectator.query('#all-presentations-link');

    // Assert
    expect(allPresentationsLink.getAttribute('href')).toEqual(
      '/presentations/search'
    );

    // Act
    spectator.click(allPresentationsLink);
    router.navigate([allPresentationsLink.getAttribute('href')]);

    // Assert
    expect(router.navigate).toHaveBeenCalledWith(['/presentations/search']);
  });

  it("Clicking on 'All Orders' link should take user to the orders landing page on same tab", () => {
    // Arrange
    const { spectator } = testSetup();
    const router = spectator.inject(Router);
    jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
    const allOrdersLink = spectator.query('#all-orders-link');

    // Assert
    expect(allOrdersLink.getAttribute('href')).toEqual('/orders');

    // Act
    spectator.click(allOrdersLink);
    router.navigate([allOrdersLink.getAttribute('href')]);

    // Assert
    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  });
});
