import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CosToastService } from '@cosmos/components/notification';
import { AuthFacade } from '@esp/auth';
import { FilesService } from '@esp/files';
import { DesignSettingsService, EspSettingsModule } from '@esp/settings';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import {
  CompanyLogoPanelRowForm,
  CompanyLogoPanelRowFormModule,
} from './company-logo-panel-row.form';

describe('CompanyLogoPanelRowForm', () => {
  let component: CompanyLogoPanelRowForm;
  let spectator: Spectator<CompanyLogoPanelRowForm>;

  const createComponent = createComponentFactory({
    component: CompanyLogoPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EspSettingsModule,
      CompanyLogoPanelRowFormModule,
    ],
    providers: [
      mockProvider(DesignSettingsService, {
        get: jest.fn(() => of({})),
        save: () => of({}),
      }),
      mockProvider(CosToastService),
      mockProvider(AuthFacade, {
        user: {
          hasRole: jest.fn(() => true),
        },
      }),
      mockProvider(FilesService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should show 'Company Logo' as title and 'No logo currently selected'", () => {
    const title = spectator.query('.settings-main-content .form-row-title');
    const value = spectator.query('.settings-main-content .cos-form-row-value');

    expect(title.textContent).toMatch('Company Logo');
    expect(value.textContent).toMatch('No logo currently selected');
  });

  it('When no value is set for the logo, no image appears', () => {
    const image = spectator.query('.settings-company-logo');

    expect(image).not.toExist();
  });

  it('should show add button on right', () => {
    const addButton = spectator.query(
      '.settings-two-col-2 > button[cos-button]'
    );
    expect(addButton).toBeVisible();
    expect(addButton.textContent).toMatch('Add');
  });

  it('If user clicks cancel, do not upload the image and return to the original state', () => {
    const editButton = spectator.query(
      '.settings-two-col-2 > button[cos-button]'
    );
    spectator.click(editButton);
    let image = spectator.query('.settings-company-logo');

    expect(image).not.toExist();

    component.control.setValue('img.jpg');
    spectator.detectComponentChanges();
    const cancelButton = spectator.query(
      '.settings-controls > button[cos-stroked-button]'
    );
    spectator.click(cancelButton);
    spectator.detectComponentChanges();

    image = spectator.query('.settings-company-logo');
    expect(image).not.toExist();
  });

  describe('Edit', () => {
    let editButton: HTMLButtonElement;

    beforeEach(() => {
      component.control.setValue('img.jpg');

      spectator.detectComponentChanges();

      editButton = spectator.query('.settings-two-col-2 > button[cos-button]');
    });

    it('should show edit button on right when file exists', () => {
      expect(editButton).toBeVisible();
      expect(editButton.textContent).toMatch('Edit');
    });

    it('should show save button disabled', () => {
      spectator.click(editButton);
      const saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      expect(saveButton).toBeVisible();
      expect(saveButton.textContent).toMatch('Save');
      expect(saveButton).toHaveAttribute('disabled');
    });

    it('Save changes should not be enabled until an image is selected', () => {
      spectator.click(editButton);
      let saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      expect(saveButton).toBeVisible();
      expect(saveButton).toHaveAttribute('disabled');

      component.control.markAsDirty();
      component.control.setValue('img2.jpg');
      spectator.detectComponentChanges();

      saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      expect(saveButton).not.toHaveAttribute('disabled');
    });

    it('When user clicks on trash icon, remove the image and enable Save Changes button', () => {
      spectator.click(editButton);
      let saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      expect(saveButton).toBeVisible();
      expect(saveButton).toHaveAttribute('disabled');
      const deleteBtn = spectator.query('.cos-icon-button.cos-warn');
      spectator.click(deleteBtn);
      spectator.detectComponentChanges();
      saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );

      expect(component.control.value).toBeNull();
      expect(saveButton).not.toHaveAttribute('disabled');
    });

    it('Once user clicks Save changes, the image should be removed', () => {
      spectator.click(editButton);
      let saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      expect(saveButton).toBeVisible();
      expect(saveButton).toHaveAttribute('disabled');
      const deleteBtn = spectator.query('.cos-icon-button.cos-warn');
      spectator.click(deleteBtn);
      spectator.detectComponentChanges();
      saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      spectator.click(saveButton);
      spectator.detectComponentChanges();
      const image = spectator.query('.settings-company-logo');

      expect(image).not.toExist();
    });

    it("'No logo currently selected' text should be displayed in View State when Logo is removed", () => {
      spectator.click(editButton);
      let saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      expect(saveButton).toBeVisible();
      expect(saveButton).toHaveAttribute('disabled');
      const deleteBtn = spectator.query('.cos-icon-button.cos-warn');
      spectator.click(deleteBtn);
      spectator.detectComponentChanges();
      saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      spectator.click(saveButton);
      spectator.detectComponentChanges();
      const title = spectator.query('.settings-main-content .form-row-title');
      const value = spectator.query(
        '.settings-main-content .cos-form-row-value'
      );

      expect(title.textContent).toMatch('Company Logo');
      expect(value.textContent).toMatch('No logo currently selected');
    });

    it('should show cancel button', () => {
      spectator.click(editButton);
      const cancelButton = spectator.query(
        '.settings-controls > button[cos-stroked-button]'
      );
      expect(cancelButton).toBeVisible();
      expect(cancelButton.textContent).toMatch('Cancel');
    });

    it('Once user selects a valid file type and clicks Save changes, display the selected file along with file name next to the image in view mode.', () => {
      spectator.click(editButton);
      const saveButton = spectator.query(
        '.settings-controls > button[type="submit"]'
      );
      expect(saveButton).toBeVisible();
      expect(saveButton.textContent).toMatch('Save');

      spectator.click(saveButton);
      spectator.detectComponentChanges();
      const image = spectator.query('.settings-company-logo');

      expect(image).toExist();
    });
  });
});
