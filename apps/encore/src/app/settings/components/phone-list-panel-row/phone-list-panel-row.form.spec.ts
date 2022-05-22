import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import {
  PhoneListPanelRowForm,
  PhoneListPanelRowFormModule,
} from './phone-list-panel-row.form';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';

describe('PhoneListPanelRowForm', () => {
  let component: PhoneListPanelRowForm;
  let spectator: Spectator<PhoneListPanelRowForm>;

  const createComponent = createComponentFactory({
    component: PhoneListPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      PhoneListPanelRowFormModule,
    ],
    providers: [
      mockProvider(PartyLocalState, {
        connect() {
          return of(this);
        },
        partyIsReady: true,
      }),
      {
        provide: PARTY_LOCAL_STATE,
        useValue: {
          connect() {
            return of(this);
          },
          partyIsReady: true,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should show 'Telephone Numbers' as title and 'No telephone numbers added'", () => {
    const title = spectator.query('.settings-two-col-1 .form-row-title');
    const value = spectator.query('.settings-two-col-1 .form-row-value');

    expect(title.textContent).toMatch('Telephone Numbers');
    expect(value.textContent).toMatch('No telephone numbers added');
  });

  it('should show add button on the right', () => {
    const addButton = spectator.query(
      '.settings-two-col-2 > button[cos-button]'
    );
    expect(addButton).toBeVisible();
    expect(addButton.textContent).toMatch('Add');
  });
});
