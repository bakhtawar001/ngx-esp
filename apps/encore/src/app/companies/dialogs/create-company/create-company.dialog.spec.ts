import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AsiCompanyFormComponent,
  AsiCompanyFormComponentModule,
  AsiCompanyInfoFormComponent,
  AsiCompanyInfoFormComponentModule,
} from '@asi/company/ui/feature-forms';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import { dataCySelector } from '@cosmos/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of, Subject } from 'rxjs';
import {
  CreateCompanyDialog,
  CreateCompanyDialogModule,
} from './create-company.dialog';
import { CreateCompanyDialogLocalState } from './create-company.local-state';

const selectors = {
  title: dataCySelector('dialog-header'),
  subTitle: dataCySelector('dialog-sub-header'),
  closeButton: dataCySelector('dialog-close-button'),
  createButton: dataCySelector('create-button'),
};

const backdropClick$ = new Subject<void>();

describe('CreateCompanyDialog', () => {
  const createComponent = createComponentFactory({
    component: CreateCompanyDialog,
    imports: [CreateCompanyDialogModule, NgxsModule.forRoot()],
    overrideModules: [
      [
        AsiCompanyFormComponentModule,
        {
          set: {
            declarations: [MockComponent(AsiCompanyFormComponent)],
            exports: [MockComponent(AsiCompanyFormComponent)],
          },
        },
      ],
      [
        AsiCompanyInfoFormComponentModule,
        {
          set: {
            declarations: [MockComponent(AsiCompanyInfoFormComponent)],
            exports: [MockComponent(AsiCompanyInfoFormComponent)],
          },
        },
      ],
    ],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
          backdropClick: () => backdropClick$,
        },
      },
    ],
  });

  const testSetup = () => {
    const spectator = createComponent({
      providers: [
        mockProvider(CreateCompanyDialogLocalState, {
          connect: () => of(this),
          create: () => EMPTY,
        }),
      ],
    });

    const dialogRef = spectator.inject(MatDialogRef, true);
    const state = spectator.inject(CreateCompanyDialogLocalState, true);

    spectator.detectChanges();

    return {
      spectator,
      component: spectator.component,
      dialogRef,
      state,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateCompanyDialog', () => {
    it('should create', () => {
      const { component, spectator } = testSetup();

      expect(spectator).toBeTruthy();
      expect(component).toBeTruthy();
    });

    it('should display dialog title', () => {
      const { spectator } = testSetup();
      const dialogTitle = spectator.query(selectors.title);

      expect(dialogTitle).toHaveText('Create New Company');
    });

    it('should display dialog intro', () => {
      const { spectator } = testSetup();
      const dialogTitle = spectator.query(selectors.subTitle);

      expect(dialogTitle).toHaveText(
        'Fill out the required fields below to add a company. Additional information can be added later.'
      );
    });

    describe('dialog close button', () => {
      it('should display close icon', () => {
        const { spectator } = testSetup();
        const modalCloseBtn = spectator.query(selectors.closeButton);

        expect(modalCloseBtn).toExist();
      });

      it('should close dialog when click on close icon', () => {
        const { spectator, dialogRef } = testSetup();

        clickCloseIcon(spectator);

        expect(dialogRef.close).toHaveBeenCalled();
      });

      describe('should display unsaved work when click on close icon if form is dirty', () => {
        it('If the data has been entered on the modal and the user attempts to dismiss without completing company creation, they should receive a warning when they attempt to navigate away from the modal with the text: Are you sure you want to discard your unsaved work?, with Yes or No option', () => {
          const { spectator, component } = testSetup();
          const confirmDialogService = spectator.inject(ConfirmDialogService);
          const confirmSpyFn = jest.spyOn(
            confirmDialogService,
            'confirmDiscardChanges'
          );
          component.formGroup.get('CompanyInformation.Name').markAsDirty();
          spectator.detectChanges();

          clickCloseIcon(spectator);

          expect(confirmSpyFn).toHaveBeenCalled();
        });

        it('should not close dialog if confirm No', () => {
          const { spectator, component, dialogRef } = testSetup();
          const confirmDialogService = spectator.inject(ConfirmDialogService);
          const confirmSpyFn = jest
            .spyOn(confirmDialogService, 'confirmDiscardChanges')
            .mockReturnValue(of(false));
          component.formGroup.get('CompanyInformation.Name').markAsDirty();
          spectator.detectChanges();

          clickCloseIcon(spectator);

          expect(confirmSpyFn).toHaveBeenCalled();
          expect(dialogRef.close).not.toHaveBeenCalled();
        });

        it('should close dialog if confirm yes', () => {
          const { spectator, component, dialogRef } = testSetup();
          const confirmDialogService = spectator.inject(ConfirmDialogService);
          const confirmSpyFn = jest
            .spyOn(confirmDialogService, 'confirmDiscardChanges')
            .mockReturnValue(of(true));
          component.formGroup.get('CompanyInformation.Name').markAsDirty();
          spectator.detectChanges();

          clickCloseIcon(spectator);

          expect(confirmSpyFn).toHaveBeenCalled();
          expect(dialogRef.close).toHaveBeenCalled();
        });
      });
    });

    describe('create company Handler', () => {
      let spectator: Spectator<CreateCompanyDialog>;
      let component: CreateCompanyDialog;
      let state: SpyObject<CreateCompanyDialogLocalState>;
      let createButton;

      beforeEach(() => {
        const { spectator: s, component: c, state: stateMock } = testSetup();
        spectator = s;
        component = c;
        state = stateMock;
        createButton = spectator.query(selectors.createButton);

        jest.spyOn(state, 'create');
        spectator.detectComponentChanges();
      });

      it('should display create button', () => {
        expect(createButton).toBeVisible();
        expect(createButton).toHaveClass('cos-button-disabled');
      });

      it('If user submits form create should be call with correct data', () => {
        component.formGroup?.get('CompanyInformation.Name').setValue('test');
        component.formGroup
          ?.get('CompanyInformation.GivenName')
          .setValue('test');
        component.formGroup
          ?.get('CompanyInformation.FamilyName')
          .setValue('test');
        component.formGroup
          ?.get('CompanyInformation.IsCustomer')
          .setValue(true);
        component.formGroup
          ?.get('CompanyInformation.Address.Line1')
          .setValue('test');
        spectator.detectComponentChanges();

        expect(createButton).not.toHaveClass('cos-button-disabled');

        spectator.click(createButton);

        expect(state.create).toHaveBeenCalled();
      });

      it('Should dispatch CompaniesActions.Create', () => {
        component.formGroup?.get('CompanyInformation.Name').setValue('test');
        component.formGroup
          ?.get('CompanyInformation.GivenName')
          .setValue('test');
        component.formGroup
          ?.get('CompanyInformation.FamilyName')
          .setValue('test');
        component.formGroup
          ?.get('CompanyInformation.IsCustomer')
          .setValue(true);
        component.formGroup
          ?.get('CompanyInformation.Address.Line1')
          .setValue('test');
        spectator.detectComponentChanges();
        expect(createButton).not.toHaveClass('cos-button-disabled');

        spectator.click(createButton);

        expect(state.create).toHaveBeenCalled();
      });

      it('should call state.create with navigate true when create another company checkbox is not checked', () => {
        component.formGroup?.get('CompanyInformation.Name').setValue('test');
        component.formGroup
          ?.get('CompanyInformation.GivenName')
          .setValue('test');
        component.formGroup
          ?.get('CompanyInformation.FamilyName')
          .setValue('test');
        component.formGroup
          ?.get('CompanyInformation.IsCustomer')
          .setValue(true);
        spectator.detectComponentChanges();

        expect(createButton).not.toHaveClass('cos-button-disabled');

        spectator.click(createButton);

        expect(state.create).toHaveBeenCalledWith(expect.anything());
      });

      it('should disable submit button after clicking it', () => {
        component.formGroup?.get('CompanyInformation.Name').setValue('test');
        component.formGroup
          ?.get('CompanyInformation.GivenName')
          .setValue('test');
        component.formGroup
          ?.get('CompanyInformation.FamilyName')
          .setValue('test');
        component.formGroup
          ?.get('CompanyInformation.IsCustomer')
          .setValue(true);
        spectator.detectComponentChanges();

        expect(createButton).not.toHaveClass('cos-button-disabled');

        spectator.click(createButton);

        expect(createButton).toHaveClass('cos-button-disabled');
      });
    });
  });
});

function clickCloseIcon(spectator: Spectator<CreateCompanyDialog>): void {
  spectator.click(selectors.closeButton);
  backdropClick$.next();
}
