import { fakeAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { dataCySelector } from '@cosmos/testing';
import { PresentationSearch } from '@esp/models';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import {
  PresentationSelectDialog,
  PresentationSelectDialogModule,
} from './presentation-select.dialog';
import { PresentationSelectDialogSearchLocalState } from './presentation-select.local-state';

const dialog = {
  header: dataCySelector('dialog-header'),
  subHeader: dataCySelector('dialog-sub-header'),
  search: dataCySelector('dialog-search'),
  addButton: dataCySelector('dialog-new-item-button'),
  clearButton: dataCySelector('search-clear'),
};

const detailsCard = {
  title: dataCySelector('title'),
  subtitle: dataCySelector('first-subtitle'),
  createDate: dataCySelector('first-line-details'),
  lastUpdatedDate: dataCySelector('second-line-details'),
};

const mockPresentation: Partial<PresentationSearch> = {
  Id: 1,
  Customer: {
    Id: 1,
    Name: 'Customer 1',
  },
  Project: {
    Id: 1,
    Name: 'Project 1',
  },
  CreateDate: new Date(2014, 11, 16).toString(),
  UpdateDate: new Date(2015, 11, 16).toString(),
};

const createComponent = createComponentFactory({
  component: PresentationSelectDialog,
  imports: [
    NgxsModule.forRoot(),
    RouterTestingModule,
    PresentationSelectDialogModule,
  ],
  declarations: [PresentationSelectDialog],
  providers: [
    MockProvider(MatDialogRef, {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      close: () => {},
    }),
    {
      provide: MAT_DIALOG_DATA,
      useValue: {
        input: {
          subheader: 'Test subheader',
        },
      },
    },
  ],
});

const testSetup = (presentations?) => {
  const spectator = createComponent({
    providers: [
      mockProvider(PresentationSelectDialogSearchLocalState, <
        Partial<PresentationSelectDialogSearchLocalState>
      >{
        connect() {
          return of(this);
        },
        presentations: presentations,
        loading: false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        search: () => {},
      }),
    ],
  });

  return {
    spectator,
    component: spectator.component,
    state: spectator.inject(PresentationSelectDialogSearchLocalState, true),
  };
};

describe('PresentationSelectComponent', () => {
  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  it('should display title `Create a New Presentation or Select an Existing One`', () => {
    const { spectator } = testSetup();

    expect(spectator.query(dialog.header).textContent.trim()).toEqual(
      'Create a New Presentation or Select an Existing One'
    );
  });

  it('should display subtitle', () => {
    const { spectator } = testSetup();

    expect(spectator.query(dialog.subHeader).textContent.trim()).toEqual(
      'Test subheader'
    );
  });

  it('should display search with `Search for a Presentation or Customer` placeholder', () => {
    const { spectator } = testSetup();
    const dialogSearch = spectator.query(dialog.search);

    expect(dialogSearch).toBeTruthy();
    expect(dialogSearch.getAttribute('placeholder')).toEqual(
      'Search for a Presentation or Customer'
    );
  });

  it('should display button for creating new presentation with text `Create a new Presentation`', () => {
    const { spectator } = testSetup();
    const addButton = spectator.query(dialog.addButton);
    expect(addButton).toBeTruthy();
    expect(addButton).toHaveText('Create a new Presentation');
  });

  it('should click new presentation button and close dialog with `next` action and createNew: true for the flow', fakeAsync(() => {
    const { spectator } = testSetup();
    const addButton = spectator.query(dialog.addButton);
    const dialogRef = spectator.inject(MatDialogRef, true);

    jest.spyOn(dialogRef, 'close');

    spectator.click(addButton);
    spectator.tick();

    expect(dialogRef.close).toHaveBeenCalledWith({
      action: 'next',
      data: {
        createNew: true,
      },
    });
  }));

  describe('Search tests', () => {
    it("should display the 'X' button to clear search field when data is entered", fakeAsync(() => {
      const { spectator } = testSetup();
      const input = spectator.query(dialog.search);

      spectator.typeInElement('test search', input);
      spectator.tick(250);
      const clearButton = spectator.query(dialog.clearButton);
      const clearButtonIcon = clearButton.querySelector('i');

      expect(clearButton).toBeVisible();
      expect(clearButton).toHaveDescendant(clearButtonIcon);
      expect(clearButtonIcon).toHaveClass('fa fa-times');
    }));

    it('clicking on X button should clear search', fakeAsync(() => {
      const { spectator, state } = testSetup();
      const input = spectator.query(dialog.search);
      jest.spyOn(state, 'search');

      spectator.typeInElement('test search', input);
      spectator.tick(250);
      spectator.click(dialog.clearButton);
      spectator.tick(250);

      expect(state.search).toHaveBeenCalledWith({
        term: '',
        from: 1,
        editOnly: true,
      });
    }));

    it('should check if search has been called with correct term, from:1, editOnly: true', fakeAsync(() => {
      const { spectator, state } = testSetup();
      const input = spectator.query(dialog.search);
      jest.spyOn(state, 'search');

      const searchTerm = 'test term';
      spectator.typeInElement(searchTerm, input);
      spectator.tick(250);

      expect(state.search).toHaveBeenCalledWith({
        term: searchTerm,
        from: 1,
        editOnly: true,
      });
    }));
  });

  it('should show presentations cards for presentations that are available', () => {
    const { component, spectator } = testSetup([mockPresentation]);
    const presentationCards = spectator.queryAll('asi-details-card');

    expect(presentationCards).toBeVisible();
    expect(presentationCards).toHaveLength(component.presentations.length);
  });

  it('should show presentation name in presentation card', () => {
    const { spectator } = testSetup([mockPresentation]);

    expect(spectator.query(detailsCard.title).textContent.trim()).toEqual(
      'Project 1'
    );
  });

  it('should show company name in presentation card', () => {
    const { spectator } = testSetup([mockPresentation]);

    expect(spectator.query(detailsCard.subtitle).textContent.trim()).toEqual(
      'Customer 1'
    );
  });

  it('should show text with created date as longDate in presentation card', () => {
    const { spectator } = testSetup([mockPresentation]);

    expect(spectator.query(detailsCard.createDate).textContent.trim()).toEqual(
      'Created December 16, 2014'
    );
  });

  it('should show text with last updated date as longDate in presentation card', () => {
    const { spectator } = testSetup([mockPresentation]);

    expect(
      spectator.query(detailsCard.lastUpdatedDate).textContent.trim()
    ).toEqual('Last Updated December 16, 2015');
  });
});
