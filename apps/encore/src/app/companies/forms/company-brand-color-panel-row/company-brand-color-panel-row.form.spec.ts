import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AsiPanelEditableRow,
  AsiPanelEditableRowModule,
} from '@asi/ui/feature-core';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { CompanyDetailLocalState } from '../../local-states';
import {
  CompanyBrandColorPanelRowForm,
  CompanyBrandColorPanelRowFormModule,
} from './company-brand-color-panel-row.form';

const company = { ...CompaniesMockDb.Companies[0], PrimaryBrandColor: 'red' };

describe('CompanyBrandColorPanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: CompanyBrandColorPanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      CompanyBrandColorPanelRowFormModule,
      AsiPanelEditableRowModule,
    ],
  });

  const testSetup = (options?: {
    isEditable?: boolean;
    PrimaryBrandColor?: string;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(CompanyDetailLocalState, <
          Partial<CompanyDetailLocalState>
        >{
          connect() {
            return of(this);
          },
          company: {
            ...company,
            IsEditable: options?.isEditable || false,
            PrimaryBrandColor:
              options?.PrimaryBrandColor || company.PrimaryBrandColor,
          },
          save: jest.fn(() => of()),
        }),
      ],
    });
    const component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display row title', () => {
    //Arrange
    const { spectator } = testSetup();
    const titleEl = spectator.query('.settings-main-content');

    //Assert
    expect(titleEl).toContainText('Company Color');
  });
  it('should display the row icon correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const rowIcon = spectator.query('.form-row-icon');

    // Assert
    expect(rowIcon).toExist();
    expect(rowIcon).toHaveClass('fa fa-palette');
  });

  it("should display 'No color currently selected' when no color is selected", () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    component.state.company.PrimaryBrandColor = null;
    spectator.detectComponentChanges();
    const infoText = spectator.query('.form-row-value');

    // Assert
    expect(infoText).toExist();
    expect(infoText).toHaveText('No color currently selected');
  });

  it('should show default brand color of Shark Grey for card header when color is not selected (#6A7281)', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const defaultcolorValue = component.defaultColor;

    component.state.company.PrimaryBrandColor = defaultcolorValue;
    spectator.detectComponentChanges();
    const colorBox = spectator.query('.settings-color-square');

    // Assert
    expect(colorBox).toExist();
    expect(colorBox).toHaveStyle({
      backgroundColor: defaultcolorValue,
    });
  });

  it('should display the color selected, after selecting and saving color', () => {
    // Arrange
    const colorValue = '#333333';

    const { spectator } = testSetup({
      PrimaryBrandColor: colorValue,
    });
    const colorBox = spectator.query('.settings-color-square');

    // Assert
    expect(colorBox).toExist();
    expect(colorBox).toHaveStyle({
      backgroundColor: colorValue,
    });
  });

  it('should display color value', () => {
    // Arrange
    const { spectator } = testSetup();
    const colorValue = company.PrimaryBrandColor;
    const websiteRow = spectator.query('.settings-company-color-name');

    // Assert
    expect(websiteRow).toHaveText(colorValue);
  });

  describe('actions in edit mode', () => {
    it('should show edit button', () => {
      //Arrange
      const { spectator } = testSetup({
        isEditable: true,
      });

      //Act

      const editButton = spectator.query(
        byText('Edit', {
          selector: '.company-settings-brand-color button[cos-button]',
        })
      );
      // Assert
      expect(editButton).toExist();
    });
    it('should show previous value on cancel', () => {
      //Arrange
      const initialVal = '#333333';
      const newVal = '#666666';
      const { component, spectator } = testSetup({
        isEditable: true,
      });

      //Act
      component.control.setValue(initialVal);
      spectator.detectComponentChanges();

      const editButton = spectator.query(
        byText('Edit', {
          selector: '.company-settings-brand-color button[cos-button]',
        })
      );

      spectator.click(editButton);
      component.control.setValue(newVal);

      const cancelButton = spectator.query(
        byText('Cancel', {
          selector: '.company-settings-brand-color button[cos-stroked-button]',
        })
      );

      spectator.click(cancelButton);

      //Assert

      expect(component.control.value).toEqual(initialVal);
    });

    it('should have new value on save', () => {
      //Arrange
      const initialVal = '#333333';
      const newVal = '#666666';
      const { component, spectator } = testSetup({
        isEditable: true,
      });

      //Act
      component.control.setValue(initialVal);
      spectator.detectComponentChanges();

      const editButton = spectator.query(
        byText('Edit', {
          selector: '.company-settings-brand-color button[cos-button]',
        })
      );

      spectator.click(editButton);

      component.control.setValue(newVal);

      const saveButton = spectator.query(
        byText('Save', {
          selector: '.company-settings-brand-color button[cos-flat-button]',
        })
      );

      spectator.click(saveButton);

      //Assert
      expect(component.control.value).toEqual(newVal);
    });

    it('should show default color on entering a hexa value and clearing it before saving', () => {
      //Arrange

      const { component, spectator } = testSetup({
        isEditable: true,
        PrimaryBrandColor: '#333333',
      });
      const saveSpy = jest.spyOn(component.state, 'save');

      const editButton = spectator.query(
        byText('Edit', {
          selector: '.company-settings-brand-color button[cos-button]',
        })
      );
      // Act
      spectator.click(editButton);

      component.control.setValue(null);

      const saveButton = spectator.query(
        byText('Save', {
          selector: '.company-settings-brand-color button[cos-flat-button]',
        })
      );
      expect(saveButton).toExist();
      spectator.click(saveButton);

      const childEl = spectator.query(AsiPanelEditableRow);
      expect(childEl.onSaveEvent).toExist();
      childEl.onSaveEvent.emit();

      //Assert
      expect(saveSpy).toHaveBeenCalledWith({
        PrimaryBrandColor: component.defaultColor,
      });
    });
  });
});
