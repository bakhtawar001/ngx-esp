import { CosToastService } from '@cosmos/components/notification';
import { AuthFacade } from '@esp/auth';
import { FilesService } from '@esp/files';
import { MediaLink } from '@esp/models';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { CompanyDetailLocalState } from '../../local-states';
import {
  CompanyLogoRowForm,
  CompanyLogoRowFormModule,
} from './company-logo-row.form';

const party = CompaniesMockDb.Companies[0];

describe('CompanyLogoRowForm', () => {
  const createComponent = createComponentFactory({
    component: CompanyLogoRowForm,
    imports: [CompanyLogoRowFormModule],
    providers: [
      mockProvider(CompanyDetailLocalState),
      mockProvider(AuthFacade),
      mockProvider(FilesService),
      mockProvider(CosToastService),
    ],
  });

  const testSetup = (options?: {
    isEditable?: boolean;
    LogoMediaLink?: MediaLink;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(CompanyDetailLocalState, {
          connect() {
            return of(this);
          },
          party: {
            ...party,
            IsEditable: options?.isEditable || false,
            LogoMediaLink: options?.LogoMediaLink,
          },
        }),
      ],
    });

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    //Arrange
    const { spectator, component } = testSetup();

    //Assert
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display the row icon', () => {
    // Arrange
    const { spectator } = testSetup();
    const icon = spectator.query('.form-row-icon');

    // Assert
    expect(icon).toExist();
    expect(icon).toHaveClass('fa fa-atom');
  });

  it('should display row title', () => {
    //Arrange
    const { spectator } = testSetup();
    const titleEl = spectator.query('.settings-main-content');

    //Assert
    expect(titleEl).toContainText('Company Logo');
  });

  it('should not display logo', () => {
    //Arrange
    const { spectator } = testSetup();
    const noLogoEl = spectator.query('.form-row-value');

    // Assert
    expect(noLogoEl.textContent).toContain('No logo currently selected');
  });

  it('should display logo', () => {
    //Arrange
    const { spectator } = testSetup({
      LogoMediaLink: { MediaId: 123, FileUrl: 'img.png' },
    });
    const LogoImg = spectator.query('img.settings-company-logo');

    // Assert
    expect(LogoImg).toExist();
    expect(LogoImg).toHaveAttribute('src', 'img.png');
  });

  describe('actions in edit mode', () => {
    it('should show previous value on cancel', () => {
      //Arrange
      const initialVal = { MediaId: 123, FileUrl: 'img.png' };
      const newVal = { MediaId: 234, FileUrl: 'img.png' };
      const { component, spectator } = testSetup({
        isEditable: true,
      });

      //Act
      component.control.setValue(initialVal);
      spectator.detectComponentChanges();

      const editButton = spectator.query(
        byText('Edit', {
          selector: 'button[cos-button]',
        })
      );

      spectator.click(editButton);
      component.control.setValue(newVal);

      const cancelButton = spectator.query(
        byText('Cancel', {
          selector: 'button[cos-stroked-button]',
        })
      );

      spectator.click(cancelButton);

      //Assert
      expect(component.control.value.MediaId).toEqual(123);
    });

    it('should have new value on save', () => {
      //Arrange
      const initialVal = { MediaId: 123, FileUrl: 'img.png' };
      const newVal = { MediaId: 234, FileUrl: 'img.png' };
      const { component, spectator } = testSetup({
        isEditable: true,
      });

      //Act
      component.control.setValue(initialVal);
      spectator.detectComponentChanges();

      const editButton = spectator.query(
        byText('Edit', {
          selector: 'button[cos-button]',
        })
      );

      spectator.click(editButton);

      component.control.setValue(newVal);

      const saveButton = spectator.query(
        byText('Save', {
          selector: 'button[cos-flat-button]',
        })
      );

      spectator.click(saveButton);

      //Assert
      expect(component.control.value.MediaId).toEqual(234);
    });
  });
});
