import { dataCySelector } from '@cosmos/testing';
import { SEARCH_LOCAL_STATE } from '@esp/search';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { PROJECT_SEARCH_LOCAL_STATE } from '../../local-states';
import {
  ProjectSearchFiltersComponent,
  ProjectSearchFiltersModule,
} from '../project-search-filters';
import {
  ProjectSearchHeaderComponent,
  ProjectSearchHeaderModule,
} from './project-search-header.component';

const header = dataCySelector('header');
const search = 'esp-search-box';
const filters = dataCySelector('project-search-filters');
const actionButtons = {
  createNewPresentationLabel: dataCySelector('create-new-presentation'),
  createNewPresentationIcon: dataCySelector('create-new-presentation') + ' i',
  createNewPresentationButton:
    'button > ' + dataCySelector('create-new-presentation'),
  createNewOrderLabel: dataCySelector('create-new-order'),
  createNewOrderIcon: dataCySelector('create-new-order') + ' i',
  createNewOrderButton: 'button > ' + dataCySelector('create-new-order'),
};

const stateMock = {
  tabs: [
    { name: 'Active' },
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
};
const createComponent = createComponentFactory({
  component: ProjectSearchHeaderComponent,
  imports: [ProjectSearchHeaderModule],
  overrideModules: [
    [
      ProjectSearchFiltersModule,
      {
        set: {
          declarations: [MockComponent(ProjectSearchFiltersComponent)],
          exports: [MockComponent(ProjectSearchFiltersComponent)],
        },
      },
    ],
  ],
  providers: [
    {
      provide: SEARCH_LOCAL_STATE,
      useValue: stateMock,
    },
    {
      provide: PROJECT_SEARCH_LOCAL_STATE,
      useValue: stateMock,
    },
  ],
});

const testSetup = () => {
  const spectator = createComponent();

  return { spectator, component: spectator.component };
};

describe('ProjectSearchHeaderComponent', () => {
  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should display header containing bold "Projects" title', () => {
    const { spectator } = testSetup();

    expect(spectator.query(header).textContent.trim()).toEqual('Projects');
    expect(spectator.query(header)).toHaveClass('bold');
  });

  describe('Search', () => {
    it('should have placeholder', () => {
      const { spectator } = testSetup();

      expect(spectator.query(search).getAttribute('placeholder')).toEqual(
        'Search All Projects'
      );
    });
  });

  describe('Filters', () => {
    it('should display filters component', () => {
      const { spectator } = testSetup();

      expect(spectator.query(filters)).toBeTruthy();
    });
  });

  describe('Action buttons', () => {
    it('should display create new presentation button', () => {
      const { spectator } = testSetup();

      expect(
        spectator.query(actionButtons.createNewPresentationButton)
      ).toBeTruthy();
      expect(
        spectator.query(actionButtons.createNewPresentationIcon)
      ).toHaveClass(['fa', 'fa-plus']);
      expect(
        spectator
          .query(actionButtons.createNewPresentationLabel)
          .textContent.trim()
      ).toEqual('Create a New Presentation');
    });

    it('should display create new order button', () => {
      const { spectator } = testSetup();

      expect(spectator.query(actionButtons.createNewOrderButton)).toBeTruthy();
      expect(spectator.query(actionButtons.createNewOrderIcon)).toHaveClass([
        'fa',
        'fa-plus',
      ]);
      expect(
        spectator.query(actionButtons.createNewOrderLabel).textContent.trim()
      ).toEqual('Create New Order');
    });

    it('should emit event when "Create New Order" button was clicked', () => {
      const { spectator, component } = testSetup();

      jest.spyOn(component.createOrder, 'emit');
      spectator.click(actionButtons.createNewOrderButton);
      spectator.detectChanges();

      expect(component.createOrder.emit).toHaveBeenCalled();
    });

    it('should emit event when "Create Presentation" button was clicked', () => {
      const { spectator, component } = testSetup();

      jest.spyOn(component.createPresentation, 'emit');
      spectator.click(actionButtons.createNewPresentationButton);
      spectator.detectChanges();

      expect(component.createPresentation.emit).toHaveBeenCalled();
    });
  });
});
