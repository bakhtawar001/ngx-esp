import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { PresentationSearch } from '@esp/models';
import {
  EspSearchBoxModule,
  EspSearchPaginationModule,
  EspSearchSortModule,
  EspSearchTabsModule,
  SearchBoxComponent,
  SearchPaginationComponent,
  SearchSortComponent,
  SearchTabGroupComponent,
} from '@esp/search';
import { PresentationMockDb } from '@esp/__mocks__/presentations';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Actions, Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { CreatePresentationFlow } from '../../../projects/flows';
import {
  PresentationSearchLoaderComponent,
  PresentationSearchLoaderComponentModule,
} from './presentation-search.loader';
import { PresentationSearchLocalState } from './presentation-search.local-state';
import {
  PresentationSearchPage,
  PresentationSearchPageModule,
} from './presentation-search.page';

const presentation = {
  ...PresentationMockDb.presentation,
  Description: 'test presentation',
  ProductCount: 0,
  Project: { Id: 0, Name: 'test project' },
};

describe('PresentationSearchPageComponent', () => {
  const createComponent = createComponentFactory({
    component: PresentationSearchPage,
    imports: [PresentationSearchPageModule, RouterTestingModule],
    providers: [
      mockProvider(MatDialog),
      mockProvider(Store, {
        select: () => of('empty'),
      }),
      mockProvider(Actions),
    ],
    overrideModules: [
      [
        EspSearchSortModule,
        {
          set: {
            declarations: MockComponents(SearchSortComponent),
            exports: MockComponents(SearchSortComponent),
          },
        },
      ],
      [
        EspSearchBoxModule,
        {
          set: {
            declarations: MockComponents(SearchBoxComponent),
            exports: MockComponents(SearchBoxComponent),
          },
        },
      ],
      [
        EspSearchTabsModule,
        {
          set: {
            declarations: MockComponents(SearchTabGroupComponent),
            exports: MockComponents(SearchTabGroupComponent),
          },
        },
      ],
      [
        EspSearchPaginationModule,
        {
          set: {
            declarations: MockComponents(SearchPaginationComponent),
            exports: MockComponents(SearchPaginationComponent),
          },
        },
      ],
      [
        PresentationSearchLoaderComponentModule,
        {
          set: {
            declarations: MockComponents(PresentationSearchLoaderComponent),
            exports: MockComponents(PresentationSearchLoaderComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    hasLoaded?: boolean;
    isLoading?: boolean;
    presentations?: PresentationSearch[];
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(PresentationSearchLocalState, {
          hasLoaded: options?.hasLoaded,
          isLoading: options?.isLoading ?? false,
          presentations: options?.presentations,
          tabIndex: 0,
          connect() {
            return of(this);
          },
        }),
      ],
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should open create presentation dialog', () => {
    // Arrange
    const { spectator } = testSetup({
      hasLoaded: true,
      isLoading: false,
    });
    const createPresentationFlow = spectator.inject(
      CreatePresentationFlow,
      true
    );
    const createBtn = spectator.query('.create-presentation-btn');
    const spy = jest
      .spyOn(createPresentationFlow, 'start')
      .mockImplementation();

    // Act
    spectator.click(createBtn);

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  describe('Active Presentations', () => {
    it('should display the meatball menu when displayed on the Active Presentations tab', () => {
      // Arrange
      const { spectator } = testSetup({
        hasLoaded: true,
        presentations: [{ ...presentation, IsEditable: true, IsVisible: true }],
      });
      const presentationCardTriggerBtn = spectator
        .queryAll('cos-presentation-card')[0]
        .querySelector('button.mat-menu-trigger');

      // Assert
      expect(presentationCardTriggerBtn).toBeVisible();
    });

    it('should display all presentations that are in an open state', () => {
      // Arrange
      const { spectator, component } = testSetup({
        hasLoaded: true,
        presentations: [{ ...presentation, IsEditable: true, IsVisible: true }],
      });
      const presentationCards = spectator.queryAll('cos-presentation-card');

      // Assert
      expect(presentationCards).toHaveLength(
        component.state.presentations.length
      );
      expect(component.state.tabIndex).toEqual(0);
    });

    it('should display the Presentation Card for each presentation', () => {
      // Arrange
      const { spectator } = testSetup({
        hasLoaded: true,
        presentations: [{ ...presentation, IsEditable: true, IsVisible: true }],
      });
      const presentationCards = spectator.queryAll('cos-presentation-card');

      // Assert
      presentationCards.forEach((card) => {
        expect(card).toBeVisible();
      });
    });

    it('should have the option to preview the presentation from the presentation card 3 dot menu', () => {
      // Arrange
      const { spectator } = testSetup({
        hasLoaded: true,
        presentations: [{ ...presentation, IsEditable: true, IsVisible: true }],
      });
      const presentationCardTriggerBtn = spectator
        .queryAll('cos-presentation-card')[0]
        .querySelector('button.mat-menu-trigger');

      // Act
      spectator.click(presentationCardTriggerBtn);
      spectator.detectComponentChanges();
      const menuTriggerOptions = spectator.queryAll(
        '.mat-menu-content > esp-presentation-card-menu > button'
      );

      // Assert
      expect(menuTriggerOptions[1]).toHaveText('Preview Presentation');
      expect(menuTriggerOptions[1].tagName).toBe('BUTTON');
    });

    it('should have the option to share the presentation from the presentation card 3 dot menu', () => {
      // Arrange
      const { spectator } = testSetup({
        hasLoaded: true,
        presentations: [{ ...presentation, IsEditable: true, IsVisible: true }],
      });
      const presentationCardTriggerBtn = spectator
        .queryAll('cos-presentation-card')[0]
        .querySelector('button.mat-menu-trigger');

      // Act
      spectator.click(presentationCardTriggerBtn);
      spectator.detectComponentChanges();
      const menuTriggerOptions = spectator.queryAll(
        '.mat-menu-content > esp-presentation-card-menu > button'
      );

      // Assert
      expect(menuTriggerOptions[0]).toHaveText('Share Presentation');
      expect(menuTriggerOptions[0].tagName).toBe('BUTTON');
    });
  });

  describe('Closed Presentations', () => {
    it('should display all presentations that are in a closed state', () => {
      // Arrange
      const { spectator, component } = testSetup({
        hasLoaded: true,
        presentations: [
          { ...presentation, IsEditable: false, IsVisible: false },
        ],
      });

      // Act
      component.state.tabIndex = 1;
      spectator.detectComponentChanges();
      const presentationCards = spectator.queryAll('cos-presentation-card');

      // Assert
      expect(presentationCards).toHaveLength(
        component.state.presentations.length
      );
      expect(component.state.tabIndex).toEqual(1);
    });

    it('should not have the 3 dot menu on the presentation card', () => {
      // Arrange
      const { component, spectator } = testSetup({
        hasLoaded: true,
        presentations: [
          { ...presentation, IsEditable: false, IsVisible: false },
        ],
      });

      // Act
      component.state.tabIndex = 1;
      spectator.detectComponentChanges();
      const presentationCardTriggerBtn = spectator
        .queryAll('cos-presentation-card')[0]
        .querySelector('button.mat-menu-trigger');

      // Assert
      expect(presentationCardTriggerBtn).not.toBeVisible();
    });
  });
});
