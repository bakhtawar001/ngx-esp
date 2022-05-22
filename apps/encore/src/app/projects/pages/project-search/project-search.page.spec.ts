import { RouterTestingModule } from '@angular/router/testing';
import { dataCySelector } from '@cosmos/testing';
import { Project } from '@esp/models';
import { SEARCH_LOCAL_STATE } from '@esp/search';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponent, MockProvider } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import {
  ProjectSearchHeaderComponent,
  ProjectSearchHeaderModule,
} from '../../components/project-search-header';
import {
  ProjectsListComponent,
  ProjectsListModule,
} from '../../components/projects-list';
import { CreatePresentationFlow } from '../../flows';
import { PROJECT_SEARCH_LOCAL_STATE } from '../../local-states';
import {
  ProjectSearchPage,
  ProjectSearchPageModule,
} from './project-search.page';

const selectors = {
  tab: '.mat-tab-label',
  sort: {
    button: 'esp-search-sort .search-sort-button',
    item: '.cos-menu-item',
  },
  notFoundMessage: dataCySelector('no-results-found'),
  noSearchResultsMessage: dataCySelector('no-search-results-found'),
  noResultsButton: dataCySelector('no-results-button'),
};

const createComponent = createComponentFactory({
  component: ProjectSearchPage,
  imports: [ProjectSearchPageModule, RouterTestingModule, NgxsModule.forRoot()],
  overrideModules: [
    [
      ProjectsListModule,
      {
        set: {
          declarations: [MockComponent(ProjectsListComponent)],
          exports: [MockComponent(ProjectsListComponent)],
        },
      },
    ],
    [
      ProjectSearchHeaderModule,
      {
        set: {
          declarations: [MockComponent(ProjectSearchHeaderComponent)],
          exports: [MockComponent(ProjectSearchHeaderComponent)],
        },
      },
    ],
  ],
  providers: [MockProvider(CreatePresentationFlow)],
});

const testSetup = (options?: {
  projects?: Partial<Project>[];
  loading?: boolean;
  loaded?: boolean;
  term?: string;
}) => {
  const stateMock = {
    tabs: [
      { name: 'All' },
      { name: 'Owned by me' },
      { name: 'Shared with me' },
    ],
    sort: {
      name: '',
    },
    connect: () => of(this),
    search: () => EMPTY,
    closeProject: (project) => EMPTY,
    reopenProject: (project) => EMPTY,
    transferOwnership: (project, userId) => EMPTY,
    isLoading: options?.loading !== undefined ? options.loading : false,
    hasLoaded: options?.loaded !== undefined ? options.loaded : true,
    projects: options?.projects !== undefined ? options.projects : [{ Id: 1 }],
    term: options?.term || '',
  };

  const spectator = createComponent({
    providers: [
      {
        provide: PROJECT_SEARCH_LOCAL_STATE,
        useValue: stateMock,
      },
      {
        provide: SEARCH_LOCAL_STATE,
        useValue: stateMock,
      },
    ],
  });

  return { spectator, component: spectator.component };
};

describe('ProjectSearchPage', () => {
  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  describe('Tabs', () => {
    it('should contain 3 tabs', () => {
      const { spectator } = testSetup();

      expect(spectator.queryAll(selectors.tab).length).toEqual(3);
    });

    it('should show "All" tab', () => {
      const { spectator } = testSetup();

      expect(spectator.queryAll(selectors.tab)[0].textContent.trim()).toEqual(
        'All'
      );
    });

    it('should show "Owned by me" tab', () => {
      const { spectator } = testSetup();

      expect(spectator.queryAll(selectors.tab)[1].textContent.trim()).toEqual(
        'Owned by me'
      );
    });

    it('should show "Shared with me" tab', () => {
      const { spectator } = testSetup();

      expect(spectator.queryAll(selectors.tab)[2].textContent.trim()).toEqual(
        'Shared with me'
      );
    });
  });

  describe('Not found message', () => {
    it('should display hardcoded text when no data is fetched with no search term set', () => {
      const { spectator } = testSetup({
        projects: [],
        loaded: true,
        loading: false,
      });

      const message = spectator.query(selectors.notFoundMessage);

      expect(message.getAttribute('mainText')).toEqual('No Projects');
      expect(message.getAttribute('secondText')).toEqual(
        'There are no projects.'
      );
      expect(message.getAttribute('thirdText')).toEqual(
        'Create a new presentation to begin.'
      );
    });

    it('should display `No projects found.` when there are no results for search term', () => {
      const { spectator } = testSetup({
        projects: [],
        loaded: true,
        loading: false,
        term: 'test',
      });

      expect(
        spectator.query(selectors.noSearchResultsMessage).textContent.trim()
      ).toBe('No projects found.');
    });

    it('should display create new presentation button', () => {
      const { spectator } = testSetup({
        projects: [],
        loaded: true,
        loading: false,
      });

      expect(
        spectator.query(selectors.noResultsButton).textContent.trim()
      ).toEqual('Create New Presentation');
    });
  });

  describe('Sorting', () => {
    it('should show label', () => {
      const { spectator } = testSetup();

      expect(
        spectator.query(selectors.sort.button).textContent.trim()
      ).toContain('Sort by');
    });

    it('should contain options', () => {
      const { spectator } = testSetup();

      spectator.click(selectors.sort.button);

      const sortOptions = spectator.queryAll(selectors.sort.item);
      expect(sortOptions.length).toEqual(5);
      expect(sortOptions[0].textContent.trim()).toEqual('Last Updated');
      expect(sortOptions[1].textContent.trim()).toEqual('Oldest');
      expect(sortOptions[2].textContent.trim()).toEqual('Newest');
      expect(sortOptions[3].textContent.trim()).toEqual('Name A-Z');
      expect(sortOptions[4].textContent.trim()).toEqual('Name Z-A');
    });
  });
});
