import { PhoneTypeEnum } from '@esp/models';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { PhoneListForm, PhoneListFormModule } from './phone-list.form';

describe('PhoneListForm', () => {
  const createComponent = createComponentFactory({
    component: PhoneListForm,
    imports: [PhoneListFormModule, NgxsModule.forRoot()],
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;
    return { spectator, component };
  };

  it('should create', () => {
    //Arrange
    const { component } = testSetup();

    //Assert
    expect(component).toBeTruthy();
  });

  it('Should display user with phone type field, phone number field, add phone number link and this is my primary phone number text', () => {
    //Arrange
    const { component, spectator } = testSetup();

    //Act
    component.addItem({
      Country: 'USA',
      IsPrimary: true,
      Number: '',
      PhoneCode: '1',
      Type: PhoneTypeEnum.Mobile,
    });
    spectator.detectComponentChanges();

    const typeField = spectator.query('.form-panel-field__type');
    const phoneField = spectator.query('.form-panel-field__phone');
    const primaryText = spectator.query('.form-panel-field__primary-msg');
    const addPhoneLink = spectator.query('.form-panel-field__add-field-btn');

    //Assert
    expect(typeField).toBeVisible();
    expect(phoneField).toBeVisible();
    expect(primaryText.textContent).toMatch(
      'This is my primary telephone number'
    );
    expect(addPhoneLink).toBeVisible();
    expect(addPhoneLink.children[0].tagName).toEqual('I');
    expect(addPhoneLink.children[0]).toHaveClass('fa fa-plus');
    expect(addPhoneLink.textContent).toMatch('Add Telephone Number');
  });

  it('Should Telephone Number have maxlength 30', () => {
    //Arrange
    const { component, spectator } = testSetup();

    //Act
    component.addItem({
      Country: 'USA',
      IsPrimary: true,
      Number: '',
      PhoneCode: '1',
      Type: PhoneTypeEnum.Mobile,
    });
    spectator.detectComponentChanges();

    const phoneField = spectator.query('input[formcontrolname="Number"]');

    //Assert
    expect(phoneField).toBeVisible();
    expect(phoneField).toHaveAttribute('maxlength', '30');
  });

  it('should display remove icon button if more than one telephone numbers', () => {
    //Arrange
    const { component, spectator } = testSetup();

    // Act
    component.addItem({
      Country: 'USA',
      IsPrimary: false,
      Number: '',
      PhoneCode: '1',
      Type: PhoneTypeEnum.Mobile,
    });
    spectator.detectComponentChanges();

    const addPhoneLink = spectator.query('.form-panel-field__add-field-btn');
    spectator.click(addPhoneLink);

    const trashBtns = spectator.queryAll(
      'button.cos-button.cos-warn > i.fa.fa-trash'
    );

    //Assert
    expect(trashBtns).toHaveLength(2);
    expect(trashBtns[0].parentElement.parentElement).not.toHaveClass(
      'btn-hidden'
    );
    expect(trashBtns[1].parentElement.parentElement).not.toHaveClass(
      'btn-hidden'
    );
  });

  it('should have remove feilds and not display remove icon if have one field after clicking on remove Icon ', () => {
    //Arrange
    const { component, spectator } = testSetup();

    // Act
    component.addItem({
      Country: 'USA',
      IsPrimary: false,
      Number: '',
      PhoneCode: '1',
      Type: PhoneTypeEnum.Mobile,
    });
    spectator.detectComponentChanges();

    const addPhoneLink = spectator.query('.form-panel-field__add-field-btn');
    spectator.click(addPhoneLink);

    const trashBtns = spectator.queryAll(
      'button.cos-button.cos-warn > i.fa.fa-trash'
    );

    expect(trashBtns).toHaveLength(2);
    expect(component.form.controls).toHaveLength(2);

    spectator.click(trashBtns[0]);
    spectator.detectChanges();

    const modifiedTrashsBtns = spectator.queryAll(
      'button.cos-button.cos-warn > i.fa.fa-trash'
    );

    //Assert
    expect(component.form.controls).toHaveLength(1);
    expect(modifiedTrashsBtns).toHaveLength(1);
    expect(modifiedTrashsBtns[0].parentElement.parentElement).toHaveClass(
      'btn-hidden'
    );
  });
});
