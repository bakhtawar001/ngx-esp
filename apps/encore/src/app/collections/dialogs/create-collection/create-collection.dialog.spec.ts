import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CosEmojiMenuComponent,
  CosEmojiMenuModule,
} from '@cosmos/components/emoji-menu';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponents } from 'ng-mocks';
import { Subject } from 'rxjs';
import {
  CreateCollectionDialog,
  CreateCollectionDialogModule,
} from './create-collection.dialog';

describe('CreateCollectionDialog', () => {
  let spectator: Spectator<CreateCollectionDialog>;
  let component: CreateCollectionDialog;
  let dialogRef: MatDialogRef<any, any>;
  const backdropClickSubject: Subject<any> = new Subject();

  const createComponent = createComponentFactory({
    component: CreateCollectionDialog,
    imports: [CreateCollectionDialogModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
          backdropClick: () => backdropClickSubject,
        },
      },
    ],
    overrideModules: [
      [
        CosEmojiMenuModule,
        {
          set: {
            declarations: MockComponents(CosEmojiMenuComponent),
            exports: MockComponents(CosEmojiMenuComponent),
          },
        },
      ],
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    dialogRef = spectator.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change emoji', () => {
    const randomImage = 'https://imageserver.com/test-image32423';
    component.changeEmoji({ newValue: randomImage });
    expect(component.createForm.get('Emoji').value).toBe(randomImage);
  });

  it('Title of collection header should be displayed with the collection field', () => {
    const dialogHeaderSection = spectator.query('.dialog-header-section');
    expect(dialogHeaderSection).toExist();
    expect(dialogHeaderSection.childNodes[1]).toHaveText(
      'Create a new Collection'
    );
    expect(dialogHeaderSection.childNodes[2]).toHaveText(
      'Add a title and description for your new Collection'
    );
    const title = spectator.query('.collection-title');
    expect(title).toExist();
    expect(title).toHaveText('Title of Collection');
    expect(spectator.query('.collection-field')).toExist();
  });

  it('Collection text field should default to: New Collection text', () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    expect(collectionNameInput).toExist();
    expect(collectionNameInput).toHaveValue('New Collection');
    expect(collectionNameInput).toHaveValue(
      component.createForm.get('Name').value
    );
  });

  it('Collection description field should be enabled and empty by default', () => {
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    expect(collectionDescriptionInput).toExist();
    expect(collectionDescriptionInput).toHaveValue('');
    expect(collectionDescriptionInput).toHaveValue(
      component.createForm.get('Description').value
    );
  });

  it('Box emoji should be the default emoji for a new collection', () => {
    const defaultEmoji = ':package:';
    const emoji = spectator.query('.collection-emoji');
    expect(emoji).toExist();
    expect(emoji.attributes.item(1).value).toEqual(defaultEmoji);
    expect(component.createForm.get('Emoji').value).toEqual(defaultEmoji);
  });

  it("'Create New collection' button should be enabled when user enters data in the Collection Name field and tabs out", () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    expect(collectionNameInput).toExist();
    spectator.typeInElement('', collectionNameInput);
    spectator.dispatchKeyboardEvent(collectionNameInput, 'keyup', {
      key: 'Tab',
      keyCode: 9,
    });
    spectator.detectChanges();
    expect(component.createForm.get('Name').value).toEqual('');
    let createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toExist();
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeTruthy();
    expect(component.createForm.invalid).toBeTruthy();
    spectator.typeInElement('test', collectionNameInput);
    spectator.dispatchKeyboardEvent(collectionNameInput, 'keyup', {
      key: 'Tab',
      keyCode: 9,
    });
    spectator.detectChanges();
    expect(component.createForm.get('Name').value).toEqual('test');
    createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it("'Create New collection' button should be disabled when user removes data in the Collection Name field and tabs out", () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    expect(collectionNameInput).toExist();
    spectator.typeInElement('', collectionNameInput);
    spectator.dispatchKeyboardEvent(collectionNameInput, 'keyup', {
      key: 'Tab',
      keyCode: 9,
    });
    spectator.detectChanges();
    expect(component.createForm.get('Name').value).toEqual('');
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toExist();
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeTruthy();
    expect(component.createForm.invalid).toBeTruthy();
  });

  it('User should be able to create collection without entering description', () => {
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    expect(collectionDescriptionInput).toHaveValue('');
    expect(component.createForm.get('Description').value).toEqual('');
    expect(collectionDescriptionInput).toHaveValue(
      component.createForm.get('Description').value
    );
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with description entered', () => {
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    spectator.typeInElement('test description', collectionDescriptionInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with minimal data in product name and description field', () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    spectator.typeInElement('a', collectionNameInput);
    spectator.typeInElement('d', collectionDescriptionInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with alpha characters in collection name field', () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    spectator.typeInElement('abc123', collectionNameInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with numeric characters in the collection name field', () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    spectator.typeInElement('123', collectionNameInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with special characters in collection name field', () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    spectator.typeInElement('*&^<>?/', collectionNameInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with alpha characters in collection description field', () => {
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    spectator.typeInElement('abc123', collectionDescriptionInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with numeric characters in collection description field', () => {
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    spectator.typeInElement('123', collectionDescriptionInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with special characters in collection description field. e.g. * & ^<>?/', () => {
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    spectator.typeInElement('*&^<>?/', collectionDescriptionInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('Add collection with maximum special characters in name and description field', () => {
    const testName = '@#$%^!&*^%$#%^&*()(*&^%$#@(&%@&!@#$%^&*()(*&^%$#@!';
    const testDescription =
      '@#$%^!&*^%$#%^&*()(*&^%$#@(&%@&!@#$%^&*()(*&^%$#@!@#$%^!&*^%$#%^&*()(*&^%$#@(&%@&!@#$%^&*()(*&^%$#@!';
    const collectionNameInput = spectator.query('.collection-name-input');
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    expect(Number(collectionNameInput.getAttribute('maxlength'))).toEqual(
      testName.length
    );
    expect(
      Number(collectionDescriptionInput.getAttribute('maxlength'))
    ).toEqual(testDescription.length);
    spectator.typeInElement(testName, collectionNameInput);
    spectator.typeInElement(testDescription, collectionDescriptionInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with maximum allowed characters in the collection name field. i.e. 50', () => {
    const testName = '@#$%^!&*^%$#%^&*abc*&^%$#@(123&!@#$%^&*()(*&^%$#@!';
    const collectionNameInput = spectator.query('.collection-name-input');
    expect(Number(collectionNameInput.getAttribute('maxlength'))).toEqual(
      testName.length
    );
    spectator.typeInElement(testName, collectionNameInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create collection with maximum allowed characters in the collection description field. i.e. 100 characters', () => {
    const testDescription =
      '@#$%^!&*^%$#%^&*abc*&^%$#@(&%@&!@#$%123()(*&^%$#@!@#$test*^%$#%^&*()(*&^%$#@(&%@&!@#$%^&*()(*&^%$#@!';
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    expect(
      Number(collectionDescriptionInput.getAttribute('maxlength'))
    ).toEqual(testDescription.length);
    spectator.typeInElement(testDescription, collectionDescriptionInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should not be able to enter more than the 50 characters in the collection name field', () => {
    const testName = '@#$%^!&*^%$#%^&*abc*&^%$#@(123&!@#$%^&*()(*&^%$#@!test';
    let collectionNameInput = spectator.query('.collection-name-input');
    let maxLength = Number(collectionNameInput.getAttribute('maxlength'));
    expect(maxLength).toBeLessThan(testName.length);
    spectator.typeInElement(testName.slice(0, maxLength), collectionNameInput);
    spectator.detectChanges();
    collectionNameInput = spectator.query('.collection-name-input');
    maxLength = Number(collectionNameInput.getAttribute('maxlength'));
    expect(collectionNameInput).toHaveValue(testName.slice(0, maxLength));
  });

  it('User should not be able to enter more than the 100 characters in the collection description field', () => {
    const testDescription =
      '@#$%^!&*^%$#%^&*abc*&^%$#@(&%@&!@#$%123()(*&^%$#@!@#$test*^%$#%^&*()(*&^%$#@(&%@&!@#$%^&*()(*&^%$#@!test123';
    let collectionDescriptionInput = spectator.query('.collection-description');
    let maxLength = Number(
      collectionDescriptionInput.getAttribute('maxlength')
    );
    expect(maxLength).toBeLessThan(testDescription.length);
    spectator.typeInElement(
      testDescription.slice(0, maxLength),
      collectionDescriptionInput
    );
    spectator.detectChanges();
    collectionDescriptionInput = spectator.query('.collection-description');
    maxLength = Number(collectionDescriptionInput.getAttribute('maxlength'));
    expect(collectionDescriptionInput).toHaveValue(
      testDescription.slice(0, maxLength)
    );
  });

  it('User should be able to create collection with the default emoji(box)', () => {
    const defaultEmoji = ':package:';
    const emoji = spectator.query('.collection-emoji');
    expect(emoji).toExist();
    expect(emoji.attributes.item(1).value).toEqual(defaultEmoji);
    expect(component.createForm.get('Emoji').value).toEqual(defaultEmoji);
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it('User should be able to create a collection with non default emoji', () => {
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
  });

  it("New collection should be created successfully when user enters the required data and clicks 'Create new Collection' button", () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    spectator.typeInElement('test name', collectionNameInput);
    spectator.typeInElement('test description', collectionDescriptionInput);
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeFalsy();
    expect(component.createForm.invalid).toBeFalsy();
    const value = component.createForm.value;
    spectator.click(createCollectionBtn);
    expect(dialogRef.close).toHaveBeenLastCalledWith(value);
  });

  it("Clicking 'Create new Collection' button should close the menu", () => {
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toContainText('Create new Collection');
    const value = component.createForm.value;
    spectator.click(createCollectionBtn);
    expect(dialogRef.close).toHaveBeenLastCalledWith(value);
  });

  it("Collection should not be created when user enters the data and closes the modal without clicking on 'Create New collection' button", () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    spectator.typeInElement('test name', collectionNameInput);
    spectator.typeInElement('test description', collectionDescriptionInput);
    spectator.detectChanges();
    const closeButton = spectator.query('.cos-modal-close');
    expect(closeButton).toContainText('Close');
    spectator.click(closeButton);
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it('Collection should not be created when user enters the data and clicks at the back button', () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    const collectionDescriptionInput = spectator.query(
      '.collection-description'
    );
    spectator.typeInElement('test name', collectionNameInput);
    spectator.typeInElement('test description', collectionDescriptionInput);
    spectator.detectChanges();
    const backButton = spectator.query('.cancel-create-collection-btn');
    expect(backButton).toContainText('Back');
    spectator.click(backButton);
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it('User should not be able to copy a collection without collection name.', () => {
    const collectionNameInput = spectator.query('.collection-name-input');
    expect(collectionNameInput).toExist();
    spectator.typeInElement('', collectionNameInput);
    spectator.detectChanges();
    expect(component.createForm.get('Name').value).toEqual('');
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(createCollectionBtn).toExist();
    expect(createCollectionBtn).toContainText('Create new Collection');
    expect(createCollectionBtn.getAttribute('disabled')).toBeTruthy();
    expect(component.createForm.invalid).toBeTruthy();
  });

  it('Dismissing the Create new collection modal should redirect user back to the source collection detail page and the collection should not be copied/created and success/error toast shoud not be displayed.', () => {
    const cancelButton = spectator.query('.cos-modal-close');
    expect(cancelButton).toExist();
    spectator.click(cancelButton);
    spectator.detectChanges();
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it('Clicking Back on Create new collection modal should redirect user back to the source collection detail page and the collection should not be copied/created and success/error toast shoud not be displayed.', () => {
    const backButton = spectator.query('.cancel-create-collection-btn');
    expect(backButton).toContainText('Back');
    spectator.click(backButton);
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });
});
