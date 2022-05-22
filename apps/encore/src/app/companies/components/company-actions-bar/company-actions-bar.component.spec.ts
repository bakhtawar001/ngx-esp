import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SortOption } from '@esp/search';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { EMPTY, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CompaniesDialogService } from '../../services';
import {
  CompanyActionsBarComponent,
  CompanyActionsBarComponentModule,
} from './company-actions-bar.component';
import { CompanyActionsBarLocalState } from './company-actions-bar.local-state';

describe('CompanyActionsBarComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanyActionsBarComponent,
    imports: [
      CompanyActionsBarComponentModule,
      RouterTestingModule,
      HttpClientModule,
    ],
    providers: [
      mockProvider(CompaniesDialogService, {
        createCompany: () => EMPTY,
      }),
      mockProvider(Store, {
        select: (selector: any) => of('empty'),
      }),
      mockProvider(CompanyActionsBarLocalState),
    ],
  });

  const testSetup = (options?: { sort?: SortOption }) => {
    const detectChanges$ = new Subject<void>();

    const spectator = createComponent({
      providers: [
        mockProvider(CompanyActionsBarLocalState, <
          Partial<CompanyActionsBarLocalState>
        >{
          connect() {
            return detectChanges$.pipe(switchMap(() => of(this)));
          },
          searchType: {
            value: 'customer',
            title: 'Customers',
            type: 'Customer',
          },
        }),
      ],
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should display the 3 dot menu button', () => {
    // Arrange
    const { spectator } = testSetup();
    const actionsBtn = spectator.query('.actions-button');

    // Assert
    expect(actionsBtn).toExist();
    expect(actionsBtn).toHaveDescendant('.fa.fa-ellipsis-h');
  });

  it("should display the 'Import from Account' button correctly", () => {
    // Arrange
    const { spectator } = testSetup();
    const buttons = spectator.queryAll('.desktop-actions > button');

    // Assert
    expect(buttons[0]).toExist();
    expect(buttons[0].tagName).toBe('BUTTON');
    expect(buttons[0]).toHaveText('Import from Account');
  });

  it("should display the 'Import from File' button correctly", () => {
    // Arrange
    const { spectator } = testSetup();
    const buttons = spectator.queryAll('.desktop-actions > button');

    // Assert
    expect(buttons[1]).toExist();
    expect(buttons[1].tagName).toBe('BUTTON');
    expect(buttons[1]).toHaveText('Import from File');
  });

  it("should display the 'Create New' button correctly", () => {
    // Arrange
    const { spectator } = testSetup();
    const buttons = spectator.queryAll('.desktop-actions > button');

    // Assert
    expect(buttons[2]).toExist();
    expect(buttons[2].tagName).toBe('BUTTON');
    expect(buttons[2]).toHaveText('Create New');
  });

  it("should open the Create new entity dialog when 'Create New' button is clicked", () => {
    // Arrange
    const { spectator } = testSetup();
    const modalService = spectator.inject(CompaniesDialogService);
    const spyFn = jest.spyOn(modalService, 'createCompany');
    const createBtn = spectator.queryAll('.desktop-actions > button')[2];

    // Act
    spectator.click(createBtn);

    // Assert
    expect(spyFn).toHaveBeenCalled();
  });

  it('should display the text as: Create new (selected type), as Create new button text', () => {
    // Arrange
    const { spectator, component } = testSetup();
    const createBtn = spectator.queryAll('.desktop-actions > button')[2];

    // Act

    // Assert
    expect(createBtn).toHaveText(
      `Create New ${component.state.searchType.type}`
    );
  });
});
