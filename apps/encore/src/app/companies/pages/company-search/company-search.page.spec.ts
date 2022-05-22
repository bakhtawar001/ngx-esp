import { fakeAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { CosToastService } from '@cosmos/components/notification';
import { dataCySelector } from '@cosmos/testing';
import { AuthFacade } from '@esp/auth';
import { CompaniesService } from '@esp/companies';
import { CompanySearch } from '@esp/models';
import { SortOption } from '@esp/search';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { EMPTY, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DirectoryMenu, DIRECTORY_MENU } from '../../../directory/configs';
import { CompanyCardComponentModule } from '../../components/company-card/company-card.component';
import { COMPANIES_SORT_OPTIONS, COMPANIES_TABS } from '../../configs';
import { CompanySearchLocalState } from '../../local-states';
import {
  CompanySearchPage,
  CompanySearchPageModule,
} from './company-search.page';

const selectors = {
  noPartiesInfo: dataCySelector('no-parties-info'),
  noPartiesButton: dataCySelector('no-parties-info') + ' button',
  noSearchResultsInfo: dataCySelector('no-search-results-info'),
};

describe('CompanySearchPage', () => {
  const createComponent = createComponentFactory({
    component: CompanySearchPage,
    imports: [
      RouterTestingModule,
      CompanySearchPageModule,
      CompanyCardComponentModule,
    ],
    providers: [
      { provide: DIRECTORY_MENU, useValue: DirectoryMenu },
      mockProvider(Store, {
        select: (selector: any) => of('empty'),
      }),
      mockProvider(AuthFacade),
      mockProvider(CompaniesService),
      mockProvider(CosToastService),
      mockProvider(CollaboratorsDialogService),
      mockProvider(MatDialog),
    ],
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testSetup = (options?: {
    sort?: SortOption;
    companies?: Partial<CompanySearch>[];
    type?: string;
    term?: string;
  }) => {
    const detectChanges$ = new Subject<void>();
    const sort = options?.sort || COMPANIES_SORT_OPTIONS[0];
    const searchType = {
      value: 'customer',
      title: 'Customers',
      type: options?.type || 'Customer',
    };

    const spectator = createComponent({
      providers: [
        mockProvider(CompanySearchLocalState, <
          Partial<CompanySearchLocalState>
        >{
          toggleStatus: () => EMPTY,
          connect() {
            return detectChanges$.pipe(switchMap(() => of(this)));
          },
          companies: options?.companies?.length ? options?.companies : [],
          companiesLoading: false,
          hasLoaded: true,
          from: 1,
          tabIndex: 0,
          tab: COMPANIES_TABS[0],
          term: options?.term || '',
          search: jest.fn(() => of()),
          searchType,
          sort,
        }),
      ],
    });

    return {
      spectator,
      component: spectator.component,
      state: spectator.inject(CompanySearchLocalState, true),
      company: CompaniesMockDb.Companies[0],
    };
  };

  it('should create', () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display the search input to search directories', () => {
    // Arrange
    const { spectator } = testSetup();
    const searchInput = spectator.query('.cos-search-field > .cos-input');

    // Assert
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
  });

  it('should display Sort by menu trigger', () => {
    // Arrange
    const { spectator } = testSetup();
    const sortByTrigger = spectator.query('.mat-menu-trigger.cos-button');

    // Assert
    expect(sortByTrigger).toExist();
    expect(sortByTrigger).toHaveText('Sort by:');
  });

  it('should display sort options when Sort by menu trigger is clicked', () => {
    // Arrange
    const { spectator } = testSetup();
    expect(spectator.queryAll('.mat-menu-item').length).toBe(0);

    // Act
    spectator.click(spectator.query('.mat-menu-trigger.cos-button'));

    // Assert
    expect(spectator.queryAll('.mat-menu-item').length).toBeGreaterThan(0);
  });

  it('should display all tabs', () => {
    // Arrange
    const { spectator, component } = testSetup();
    const tabs = spectator.queryAll('.mat-tab-label-content');

    // Assert
    expect(tabs.length).toEqual(component.tabs.length);
    expect(tabs[0]).toHaveText(component.tabs[0].name);
    expect(tabs[1]).toHaveText(component.tabs[1].name);
    expect(tabs[2]).toHaveText(component.tabs[2].name);
    expect(tabs[3]).toHaveText(component.tabs[3].name);
    expect(tabs[4]).toHaveText(component.tabs[4].name);
  });

  describe('Search', () => {
    xit('Should search as text is entered into the searchbar', fakeAsync((
      done
    ) => {
      const { spectator, component, state } = testSetup();
      const searchSpy = jest.spyOn(state, 'search');

      component.state.term = 'test';

      spectator.detectComponentChanges();

      // Subscriber is debounced 400ms
      spectator.tick(500);
      expect(searchSpy).toHaveBeenCalled();
    }));

    it('should call state.toggleState after toggle event', () => {
      //Arrange
      const { spectator, component, state, company } = testSetup();
      const toggleState = jest.spyOn(state, 'toggleStatus');

      //Act
      component.toggleStatus(company);
      spectator.detectChanges();

      //Assert
      expect(toggleState).toHaveBeenCalledWith(company.Id, !company.IsActive);

      //Act
      company.isActive = false;
      component.toggleStatus(company);
      spectator.detectChanges();

      //Assert
      expect(toggleState).toHaveBeenCalledWith(company.Id, !company.IsActive);
    });
  });

  describe('No parties info', () => {
    it('should be visible when no data was found', () => {
      const { spectator } = testSetup();

      expect(spectator.query(selectors.noPartiesInfo)).toBeVisible();
    });

    it('should display `No companies found.` when no search results were found', () => {
      const { spectator } = testSetup({ term: 'test' });

      const info = spectator.query(selectors.noSearchResultsInfo);

      expect(info).toBeVisible();
      expect(info.textContent.trim()).toBe('No companies found.');
    });

    it('should not be visible when loaded and data was found', () => {
      const { spectator } = testSetup({ companies: [{ Id: 1 }] });

      expect(spectator.query(selectors.noPartiesInfo)).not.toBeVisible();
    });

    describe('no info text', () => {
      it('should set correct emptyStateInfoOption for Company', () => {
        const { component } = testSetup({ type: 'Company' });

        expect(component.emptyStateInfoOption).toStrictEqual({
          mainText: 'No Companies',
          secondText: 'There are no companies in your directory.',
          thirdText: 'Create a new company record to begin.',
          ctaText: 'Create New Company',
        });
      });

      it('should set correct emptyStateInfoOption for Customer', () => {
        const { component } = testSetup({ type: 'Customer' });

        expect(component.emptyStateInfoOption).toStrictEqual({
          mainText: 'No Customers',
          secondText: 'There are no customers in your directory.',
          thirdText: 'Create a new customer record to begin.',
          ctaText: 'Create New Customer',
        });
      });

      it('should set correct emptyStateInfoOption for Supplier', () => {
        const { component } = testSetup({ type: 'Supplier' });

        expect(component.emptyStateInfoOption).toStrictEqual({
          mainText: 'No Suppliers',
          secondText: 'There are no suppliers in your directory.',
          thirdText: 'Create a new supplier record to begin.',
          ctaText: 'Create New Supplier',
        });
      });

      it('should set correct emptyStateInfoOption for Decorator', () => {
        const { component } = testSetup({ type: 'Decorator' });

        expect(component.emptyStateInfoOption).toStrictEqual({
          mainText: 'No Decorators',
          secondText: 'There are no decorators in your directory.',
          thirdText: 'Create a new decorator record to begin.',
          ctaText: 'Create New Decorator',
        });
      });
    });

    it('should call createContact and openCreateContactDialog on click create contact button', () => {
      // Arrange
      const { spectator, component } = testSetup();
      const createCompanySpy = jest.spyOn(component, 'createNewParty');
      const openCreateCompanyDialogSpy = jest.spyOn(
        component['_companiesDialogService'],
        'createCompany'
      );
      spectator.click(selectors.noPartiesButton);
      expect(createCompanySpy).toHaveBeenCalled();
      expect(openCreateCompanyDialogSpy).toHaveBeenCalled();
    });
  });
});
