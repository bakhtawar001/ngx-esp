import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  AsiPanelEditableRow,
  AsiPanelEditableRowModule,
} from './panel-editable-row.component';

describe('AsiPanelEditableRow', () => {
  const createComponent = createComponentFactory({
    component: AsiPanelEditableRow,
    imports: [AsiPanelEditableRowModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;
    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it("should display the text 'Loading...', when the component is loading", () => {
    // Arrange
    const { component, spectator } = testSetup();

    // Act
    spectator.setInput('isLoading', true);
    spectator.detectComponentChanges();
    const loadingSection = spectator.query('.body-style-12-shark');

    // Assert
    expect(component.isLoading).toBeTruthy();
    expect(loadingSection).toHaveText('Loading...');
  });

  it('should toggle, when Expand Icon button is clicked', () => {
    // Arrange
    const { spectator, component } = testSetup();

    // Act
    component.controls.expand = true;
    spectator.detectComponentChanges();
    const expandIconBtn = spectator.query(
      '.settings-two-col-2 > .cos-icon-button'
    );
    spectator.click(expandIconBtn);
    spectator.detectComponentChanges();

    // Assert
    expect(component.expanded).toBeFalsy();

    // Act
    spectator.click(expandIconBtn);
    spectator.detectComponentChanges();

    // Assert
    expect(component.expanded).toBeTruthy();
  });

  it('should display the Expand icon button, with angle up icon, when expanded', () => {
    // Arrange
    const { spectator, component } = testSetup();

    // Act
    component.controls.expand = true;
    spectator.detectComponentChanges();
    const expandIconBtn = spectator.query(
      '.settings-two-col-2 > .cos-icon-button'
    );

    // Assert
    expect(expandIconBtn).toExist();
    expect(expandIconBtn).toHaveDescendant('.fa.fa-angle-up');
  });

  it('should display the Expand icon button, with angle down icon, when not expanded', () => {
    // Arrange
    const { spectator, component } = testSetup();

    // Act
    component.controls.expand = true;
    spectator.setInput('expanded', false);
    spectator.detectComponentChanges();
    const expandIconBtn = spectator.query(
      '.settings-two-col-2 > .cos-icon-button'
    );

    // Assert
    expect(expandIconBtn).toExist();
    expect(expandIconBtn).toHaveDescendant('.fa.fa-angle-down');
  });

  it('should display the Remove button to remove row', () => {
    // Arrange
    const { spectator, component } = testSetup();

    // Act
    component.controls.remove = true;
    spectator.detectComponentChanges();
    const removeBtn = spectator.queryAll(
      '.settings-two-col-2 > .cos-button'
    )[1];

    // Assert
    expect(removeBtn).toExist();
    expect(removeBtn).toHaveText('Remove');
  });

  describe('Non-expanded mode tests', () => {
    it("should display the row title as 'Favicon'", () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      spectator.setInput('rowTitle', 'Favicon');
      spectator.detectComponentChanges();
      const title = spectator.query('.form-row-title');

      // Assert
      expect(title).toExist();
      expect(title).toHaveText(component.rowTitle);
      expect(title).toHaveText('Favicon');
    });

    it('should display the button to edit the row', () => {
      // Arrange
      const { spectator } = testSetup();
      const editBtn = spectator.query('.settings-two-col-2 > .cos-button');

      // Assert
      expect(editBtn).toExist();
    });

    it('should not display the button to edit the row if restricted', () => {
      // Arrange
      const { spectator, component } = testSetup();

      //Act
      component.isEditable = false;
      spectator.detectComponentChanges();
      const editBtn = spectator.query('.settings-two-col-2 > .cos-button');

      // Assert
      expect(editBtn).not.toBeVisible();
    });

    it('should show the form to edit when Edit/Add button is clicked', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const editBtn = spectator.query('.settings-two-col-2 > .cos-button');

      // Act
      spectator.click(editBtn);
      spectator.detectComponentChanges();

      // Assert
      expect(component.state.isEditing).toBeTruthy();
    });
  });

  describe('Edit mode tests', () => {
    it('should display the setting control section, while editing', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.state.isEditing = true;
      spectator.detectComponentChanges();
      const settingControlsSection = spectator.query('.settings-controls');

      // Assert
      expect(settingControlsSection).toExist();
    });

    it('should display the Cancel button, when editing', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.state.isEditing = true;
      spectator.detectComponentChanges();
      const cancelBtn = spectator.query('.cos-stroked-button.cos-primary');

      // Assert
      expect(cancelBtn).toExist();
      expect(cancelBtn.tagName).toBe('BUTTON');
      expect(cancelBtn).toHaveText('Cancel');
      expect(cancelBtn).not.toHaveClass('cos-button-disabled');
    });

    it('should hide the editing section, when Cancel button is clicked', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.state.isEditing = true;
      spectator.detectComponentChanges();
      const cancelBtn = spectator.query('.cos-stroked-button.cos-primary');
      spectator.click(cancelBtn);
      spectator.detectComponentChanges();

      // Assert
      expect(component.state.isEditing).toBeFalsy();
    });

    it('should display the Save button with appropriate text, when editing', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const selectedText = 'Save';

      // Act
      component.state.isEditing = true;
      spectator.setInput('saveButtonText', selectedText);
      spectator.detectComponentChanges();
      const saveBtn = spectator.query('.cos-flat-button.cos-primary');

      // Assert
      expect(saveBtn).toExist();
      expect(saveBtn.tagName).toBe('BUTTON');
      expect(saveBtn).toHaveText(selectedText);
      expect(saveBtn).toHaveAttribute('disabled');
    });

    it('should display the Save button as disabled, while editing and when no changes are made', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.state.isEditing = true;
      component.state.canSave = false;
      spectator.detectComponentChanges();
      const saveBtn = spectator.query('.cos-flat-button.cos-primary');

      // Assert
      expect(saveBtn).toExist();
      expect(saveBtn.tagName).toBe('BUTTON');
      expect(saveBtn).toHaveClass('cos-button-disabled');
    });

    it('should once changes are made - enable the Save CTA', () => {
      // Arrange
      const { component, spectator } = testSetup();

      // Act
      component.state.isEditing = true;
      component.state.canSave = false;
      spectator.detectComponentChanges();
      let saveBtn = spectator.query('.cos-flat-button.cos-primary');

      // Assert
      expect(saveBtn).toHaveClass('cos-button-disabled');

      // Act again
      component.state.canSave = true;
      spectator.detectComponentChanges();
      saveBtn = spectator.query('.cos-flat-button.cos-primary');

      // Re-Assert
      expect(saveBtn).not.toHaveClass('cos-button-disabled');
    });

    it("should show red toast 'Data cannot be saved' if API is unable to save selection", () => {
      // Arrange
      const { component, spectator } = testSetup();
      const spyFn = jest.spyOn(component.onSaveEvent, 'emit');

      //Act
      component.state.canSave = true;
      component.saveRow();
      spectator.detectComponentChanges();

      // Assert
      expect(spyFn).toHaveBeenCalled();
    });

    it('should return to view state upon successful saving of the selections', () => {
      // Arrange
      const { component, spectator } = testSetup();
      const spyFn = jest.spyOn(component.onSaveEvent, 'emit');

      //Act
      component.state.canSave = true;
      component.saveRow();
      spectator.detectComponentChanges();

      // Assert
      expect(spyFn).toHaveBeenCalled();
    });
  });
});
