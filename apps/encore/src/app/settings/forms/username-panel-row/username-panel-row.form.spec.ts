import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { User } from '@esp/auth';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { ProfilePageLocalState } from '../../local-state';
import {
  UsernamePanelRowForm,
  UsernamePanelRowFormModule,
} from './username-panel-row.form';

describe('UsernamePanelRowForm', () => {
  const createComponent = createComponentFactory({
    component: UsernamePanelRowForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      UsernamePanelRowFormModule,
    ],
    providers: [
      mockProvider(ProfilePageLocalState, <Partial<ProfilePageLocalState>>{
        connect() {
          return of(this);
        },
        user: {
          UserName: 'Jhon Doe',
        } as User,
      }),
    ],
  });

  const testSetup = () => {
    const spectator = createComponent();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    //Arrange
    const { spectator, component } = testSetup();

    //Assert
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display row title', () => {
    //Arrange
    const { spectator } = testSetup();
    const titleEl = spectator.query('.settings-main-content');

    //Assert
    expect(titleEl).toContainText('Username');
  });

  it('should display the row icon correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const rowIcon = spectator.query('.form-row-icon');

    // Assert
    expect(rowIcon).toExist();
    expect(rowIcon).toHaveClass('fas fa-user');
  });

  it('should display username', () => {
    // Arrange
    const { spectator } = testSetup();
    const usernameEl = spectator.query('.form-row-value');

    // Assert
    expect(usernameEl).toExist();
    expect(usernameEl).toContainText('Jhon Doe');
  });

  it('should display edit button', () => {
    //Arrange
    const initialVal = 'Jhon Doe1';
    const { component, spectator } = testSetup();

    component.control.setValue(initialVal);
    spectator.detectComponentChanges();

    const editButton = spectator.query(
      byText('Edit', {
        selector: 'button[cos-button]',
      })
    );

    //Assert
    expect(editButton).toExist();
  });

  describe('username control validation', () => {
    it('should be required', () => {
      // Arrange
      const { component, spectator } = testSetup();

      //Act
      component.control.setValue('');
      spectator.detectComponentChanges();

      //Assert
      expect(component.control.valid).toBeFalsy();
      expect(component.control.errors.required).toBeTruthy();
    });

    it('should be invalid if more than 50 characters are entered', () => {
      // Arrange

      const userName =
        'this is very long name. this is very long name. this is very long name. this is very long name. this is very long name.';
      const { component, spectator } = testSetup();

      //Act
      component.control.markAsDirty();
      component.control.setValue(userName);
      spectator.detectChanges();

      //Assert
      expect(component.control.valid).toBeFalsy();
      expect(component.control.errors.maxlength).toBeTruthy();
    });

    it("should be invalid if entered charactors other than alphanumeric characters and &'()_-@;:.,,", () => {
      // Arrange
      const userName = 'invalidPatternUsername#';
      const { component, spectator } = testSetup();

      //Act
      component.control.markAsDirty();
      component.control.setValue(userName);
      spectator.detectChanges();

      //Assert
      expect(component.control.valid).toBeFalsy();
      expect(component.control.errors.pattern).toBeTruthy();
    });

    it('should display pattern error', fakeAsync(() => {
      // Arrange
      const userName = 'invalidPatternUsername#';
      const { component, spectator } = testSetup();

      //Act
      component.control.markAsDirty();
      component.control.setValue(userName);
      spectator.detectChanges();

      const editButton = spectator.query(
        byText('Edit', {
          selector: 'button[cos-button]',
        })
      );
      spectator.click(editButton);
      const inputEl = spectator.query('input#profileUsername');
      inputEl.dispatchEvent(new Event('blur'));

      spectator.tick(400);

      const errorEl = spectator.query('cos-error');

      //Assert
      expect(component.control.valid).toBeFalsy();
      expect(inputEl).toExist();
      expect(errorEl).toExist();
      expect(component.control.errors.pattern).toBeTruthy();
      expect(errorEl).toContainText(component.patternError.pattern);
    }));
  });

  describe('actions in edit mode', () => {
    it('should show previous value on cancel', () => {
      //Arrange
      const initialVal = 'Jhon Doe1';
      const newVal = 'Max';
      const { component, spectator } = testSetup();

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

      expect(component.control.value).toEqual(initialVal);
    });

    it('should have new value on save', () => {
      //Arrange
      const initialVal = 'Jhon Doe';
      const newVal = 'Max';
      const { component, spectator } = testSetup();

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
      expect(component.control.value).toEqual(newVal);
    });
  });
});
