import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceConfig } from '@asi/auth';
import { CosToastService } from '@cosmos/components/notification';
import { AuthFacade, User } from '@esp/auth';
import { SocialMediaForm, SocialMediaFormModule } from '@esp/settings';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { LoginService } from '@smartlink/auth';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import {
  PhoneListPanelRowForm,
  PhoneListPanelRowFormModule,
} from '../../components/phone-list-panel-row';
import { AddressListPanelFormModule } from '../../forms/address-list-panel';
import { AddressListPanelForm } from '../../forms/address-list-panel/address-list-panel.form';
import { CompanyAsiNumberPanelRowFormModule } from '../../forms/company-asi-number-panel-row';
import { CompanyAsiNumberPanelRowForm } from '../../forms/company-asi-number-panel-row/company-asi-number-panel-row.form';
import { CompanyNamePanelRowFormModule } from '../../forms/company-name-panel-row';
import { CompanyNamePanelRowForm } from '../../forms/company-name-panel-row/company-name-panel-row.form';
import { EmailListPanelRowFormModule } from '../../forms/email-list-panel-row';
import { EmailListPanelRowForm } from '../../forms/email-list-panel-row/email-list-panel-row.form';
import { NamePanelRowFormModule } from '../../forms/name-panel-row';
import { NamePanelRowForm } from '../../forms/name-panel-row/name-panel-row.form';
import { PasswordPanelRowFormModule } from '../../forms/password-panel-row';
import { PasswordPanelRowForm } from '../../forms/password-panel-row/password-panel-row.form';
import { ProfileAvatarPanelRowFormModule } from '../../forms/profile-avatar-panel-row';
import { ProfileAvatarPanelRowForm } from '../../forms/profile-avatar-panel-row/profile-avatar-panel-row.form';
import {
  SignonEmailPanelRowForm,
  SignonEmailPanelRowFormModule,
} from '../../forms/signon-email-panel-row';
import { UsernamePanelRowFormModule } from '../../forms/username-panel-row';
import { UsernamePanelRowForm } from '../../forms/username-panel-row/username-panel-row.form';
import { ProfilePageLocalState } from '../../local-state';
import { ProfilePage, ProfilePageModule } from './profile.page';

const MockUser: User = {
  Id: 1,
  Name: 'Name',
  Email: 'email@email.com',
  GivenName: 'Given Name',
  FamilyName: 'Family Name',
  CompanyName: 'Company',
  AsiNumber: '125724',
  LoginEmail: 'email@email.com',
  GravatarHash: '',
  Permissions: [],
  IsAdmin: false,
  UserName: 'username',
  ContactId: 10,
  TenantCode: 'ABCD',
  TenantId: 1111,
  displayName: 'display name',
  hasPermission: () => {
    return true;
  },
  hasCapability: () => {
    return true;
  },
  hasRole: () => {
    return true;
  },
};

const MockAuthFacade = {
  user: MockUser,
  profile$: of(null),
};

describe('Profile Settings', () => {
  const createComponent = createComponentFactory({
    component: ProfilePage,
    imports: [HttpClientTestingModule, NgxsModule.forRoot(), ProfilePageModule],
    providers: [
      mockProvider(AuthServiceConfig),
      mockProvider(AuthFacade, MockAuthFacade),
      mockProvider(CosToastService),
      mockProvider(MatDialog),
      mockProvider(LoginService),
      mockProvider(ProfilePageLocalState),
    ],
    overrideModules: [
      [
        AddressListPanelFormModule,
        {
          set: {
            declarations: MockComponents(AddressListPanelForm),
            exports: MockComponents(AddressListPanelForm),
          },
        },
      ],
      [
        EmailListPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(EmailListPanelRowForm),
            exports: MockComponents(EmailListPanelRowForm),
          },
        },
      ],
      [
        NamePanelRowFormModule,
        {
          set: {
            declarations: MockComponents(NamePanelRowForm),
            exports: MockComponents(NamePanelRowForm),
          },
        },
      ],
      [
        PhoneListPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(PhoneListPanelRowForm),
            exports: MockComponents(PhoneListPanelRowForm),
          },
        },
      ],
      [
        SignonEmailPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(SignonEmailPanelRowForm),
            exports: MockComponents(SignonEmailPanelRowForm),
          },
        },
      ],
      [
        UsernamePanelRowFormModule,
        {
          set: {
            declarations: MockComponents(UsernamePanelRowForm),
            exports: MockComponents(UsernamePanelRowForm),
          },
        },
      ],
      [
        ProfileAvatarPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(ProfileAvatarPanelRowForm),
            exports: MockComponents(ProfileAvatarPanelRowForm),
          },
        },
      ],
      [
        CompanyNamePanelRowFormModule,
        {
          set: {
            declarations: MockComponents(CompanyNamePanelRowForm),
            exports: MockComponents(CompanyNamePanelRowForm),
          },
        },
      ],
      [
        CompanyAsiNumberPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(CompanyAsiNumberPanelRowForm),
            exports: MockComponents(CompanyAsiNumberPanelRowForm),
          },
        },
      ],
      [
        PasswordPanelRowFormModule,
        {
          set: {
            declarations: MockComponents(PasswordPanelRowForm),
            exports: MockComponents(PasswordPanelRowForm),
          },
        },
      ],
      [
        SocialMediaFormModule,
        {
          set: {
            declarations: MockComponents(SocialMediaForm),
            exports: MockComponents(SocialMediaForm),
          },
        },
      ],
    ],
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

  it("should display the page header as 'Profile and Login Settings'", () => {
    // Arrange
    const { spectator } = testSetup();
    const pageHeader = spectator.query('.header-style-22');

    // Assert
    expect(pageHeader).toExist();
    expect(pageHeader).toHaveText('Profile and Login Settings');
  });

  it("should display the basic information header with text as 'Basic Information'", () => {
    // Arrange
    const { spectator } = testSetup();
    const basicInfoHeader = spectator.queryAll('cos-segmented-panel')[0];

    // Assert
    expect(basicInfoHeader).toExist();
    expect(basicInfoHeader).toHaveText('Basic Information');
  });

  it("should display the password header with text as 'Password'", () => {
    // Arrange
    const { spectator } = testSetup();
    const passwordHeader = spectator.queryAll('cos-segmented-panel')[1];

    // Assert
    expect(passwordHeader).toExist();
    expect(passwordHeader).toHaveText('Password');
  });

  it("should display the language header with text as 'Language'", () => {
    // Arrange
    const { spectator } = testSetup();
    const langHeader = spectator.queryAll('cos-segmented-panel')[2];

    // Assert
    expect(langHeader).toExist();
    expect(langHeader).toHaveText('Language');
  });

  it('should display the language row icon correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const langRowIcon = spectator.query('.form-row-icon.lang-icon');

    // Assert
    expect(langRowIcon).toExist();
    expect(langRowIcon.tagName).toBe('I');
    expect(langRowIcon).toHaveClass('fas fa-language');
  });

  it('should display the language value correctly', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const langRowValue = spectator.query('.form-row-value.lang-value');
    const selectedVal = 'French (FR)';

    // Act
    component.lang.preference = selectedVal;
    spectator.detectComponentChanges();

    // Assert
    expect(langRowValue).toExist();
    expect(langRowValue).toHaveText(selectedVal);
  });

  it("should display the contact information header with text as 'Contact Information'", () => {
    // Arrange
    const { spectator } = testSetup();
    const contactInfoHeader = spectator.queryAll('cos-segmented-panel')[3];

    // Assert
    expect(contactInfoHeader).toExist();
    expect(contactInfoHeader).toHaveText('Contact Information');
  });

  it("should display the social media header with text as 'Social media'", () => {
    // Arrange
    const { spectator } = testSetup();
    const socialInfoHeader = spectator.queryAll('cos-segmented-panel')[4];

    // Assert
    expect(socialInfoHeader).toExist();
    expect(socialInfoHeader).toHaveText('Social media');
  });

  it('should display the social info row icon correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const langRowIcon = spectator.query('.form-row-icon.social-info-icon');

    // Assert
    expect(langRowIcon).toExist();
    expect(langRowIcon.tagName).toBe('I');
    expect(langRowIcon).toHaveClass('fa fa-heart');
  });

  it('should display the social info value correctly', () => {
    // Arrange
    const { spectator } = testSetup();
    const socialInfoList = spectator.query('.form-row-value-list');

    // Assert
    expect(socialInfoList).toExist();
    expect(socialInfoList.childElementCount).toEqual(3);
    expect(socialInfoList.children[0]).toHaveText('Facebook:');
    expect(socialInfoList.children[1]).toHaveText('Twitter:');
    expect(socialInfoList.children[2]).toHaveText('Instagram:');
  });
});
