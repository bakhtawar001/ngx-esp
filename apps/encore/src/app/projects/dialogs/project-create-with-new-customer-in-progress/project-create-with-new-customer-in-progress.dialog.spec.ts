import {
  ProjectCreateWithNewCustomerInProgressDialog,
  ProjectCreateWithNewCustomerInProgressModule,
} from './project-create-with-new-customer-in-progress.dialog';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { MockModule, MockProvider } from 'ng-mocks';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProjectCreateWithNewCustomerLocalState } from './project-create-with-new-customer.local-state';
import { NgxsModule } from '@ngxs/store';
import { of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

describe('ProjectCreateWithNewCustomerInProgressDialog', () => {
  const selectors = {
    creatingCustomer: '#creatingCustomer',
    creatingContact: '#creatingContact',
    creatingProject: '#creatingProject',
  };
  const createComponent = createComponentFactory({
    component: ProjectCreateWithNewCustomerInProgressDialog,
    imports: [
      ProjectCreateWithNewCustomerInProgressModule,
      MockModule(MatDialogModule),
      NgxsModule.forRoot(),
    ],
    providers: [
      MockProvider(MatDialogRef),
      MockProvider(ProjectCreateWithNewCustomerLocalState),
    ],
  });

  const testSetup = (options?: {
    creatingProject: boolean;
    creatingContact: boolean;
    creatingCustomer: boolean;
  }) => {
    const detectChanges$ = new Subject<void>();

    const spectator = createComponent({
      providers: [
        mockProvider(ProjectCreateWithNewCustomerLocalState, <
          Partial<ProjectCreateWithNewCustomerLocalState>
        >{
          connect() {
            return detectChanges$.pipe(switchMap(() => of(this)));
          },
          create: () => of(),
          creatingProject: options?.creatingProject ?? false,
          creatingContact: options?.creatingContact ?? false,
          creatingCustomer: options?.creatingCustomer ?? false,
        }),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            input: {
              customer: {},
              project: {},
            },
            step: {
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              markAsDirty: () => {},
            },
          },
        },
      ],
    });

    const state = spectator.inject(ProjectCreateWithNewCustomerLocalState);
    const spectatorDetectChanges = spectator.detectChanges;

    spectator.detectChanges = (): void => {
      spectatorDetectChanges.bind(spectator);
      detectChanges$.next();
    };

    return {
      spectator,
      component: spectator.component,
      state,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { spectator, component } = testSetup();

    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should show Creating a customer... when creatingCustomer is true', () => {
    const { spectator } = testSetup({
      creatingProject: false,
      creatingContact: false,
      creatingCustomer: true,
    });

    expect(spectator.query(selectors.creatingCustomer)).toExist();
    expect(spectator.query(selectors.creatingContact)).not.toExist();
    expect(spectator.query(selectors.creatingProject)).not.toExist();
  });

  it('should show Creating a contact... when creatingContact is true', () => {
    const { spectator } = testSetup({
      creatingProject: false,
      creatingContact: true,
      creatingCustomer: false,
    });

    expect(spectator.query(selectors.creatingCustomer)).not.toExist();
    expect(spectator.query(selectors.creatingContact)).toExist();
    expect(spectator.query(selectors.creatingProject)).not.toExist();
  });

  it('should show Creating a project... when creatingProject is true', () => {
    const { spectator } = testSetup({
      creatingProject: true,
      creatingContact: false,
      creatingCustomer: false,
    });

    expect(spectator.query(selectors.creatingCustomer)).not.toExist();
    expect(spectator.query(selectors.creatingContact)).not.toExist();
    expect(spectator.query(selectors.creatingProject)).toExist();
  });
});
