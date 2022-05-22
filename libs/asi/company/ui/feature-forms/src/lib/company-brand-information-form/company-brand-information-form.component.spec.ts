import { FormGroup } from '@angular/forms';
import { ValidateUrl } from '@cosmos/common';
import { FormControl } from '@cosmos/forms';
import { dataCySelector } from '@cosmos/testing';
import { FilesService } from '@esp/files';
import {
  EspBrandColorForm,
  EspBrandColorFormModule,
  EspImageUploadForm,
  EspImageUploadFormModule,
} from '@esp/settings';
import {
  byText,
  createComponentFactory,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';
import { ColorPickerService } from 'ngx-color-picker';
import {
  AsiCompanyBrandInformationFormComponent,
  AsiCompanyBrandInformationFormModule,
} from './company-brand-information-form.component';

const website = {
  label: dataCySelector('website-label'),
  input: '#companyWebsite',
};

const color = {
  label: dataCySelector('brand-color-picker') + ' cos-label',
  picker: dataCySelector('brand-color-picker'),
};

const logo = {
  label: dataCySelector('logo-label'),
  input: dataCySelector('logo-upload'),
};

const favicon = {
  label: dataCySelector('favicon-label'),
  input: dataCySelector('favicon-upload'),
};

describe('EspCompanyBrandInformationFormComponent', () => {
  let spectator: Spectator<AsiCompanyBrandInformationFormComponent>;
  let component: AsiCompanyBrandInformationFormComponent;

  const createComponent = createComponentFactory({
    component: AsiCompanyBrandInformationFormComponent,
    imports: [AsiCompanyBrandInformationFormModule],
    providers: [MockProvider(ColorPickerService), MockProvider(FilesService)],
    overrideModules: [
      [
        EspBrandColorFormModule,
        {
          set: {
            declarations: [MockComponent(EspBrandColorForm)],
            exports: [MockComponent(EspBrandColorForm)],
          },
        },
      ],
      [
        EspImageUploadFormModule,
        {
          set: {
            declarations: [MockComponent(EspImageUploadForm)],
            exports: [MockComponent(EspImageUploadForm)],
          },
        },
      ],
    ],
    detectChanges: false,
  });

  const testSetup = () => {
    spectator = createComponent();
    component = spectator.component;

    component.form = new FormGroup({
      Website: new FormGroup({
        IsPrimary: new FormControl(true),
        Type: new FormControl(null),
        Url: new FormControl('', [ValidateUrl]),
      }),
      PrimaryBrandColor: new FormControl(null),
      LogoMediaLink: new FormControl(null),
      IconMediaLink: new FormControl(null),
    });

    spectator.detectChanges();

    return { component, spectator };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Website', () => {
    it('should show label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(website.label)).toBeTruthy();
      expect(spectator.query(website.label).textContent).toEqual('Website');
    });

    it('should show text input', () => {
      const { spectator } = testSetup();
      expect(spectator.query(website.input)).toBeTruthy();
    });

    it('should show placeholder', () => {
      const { spectator } = testSetup();
      expect(
        spectator.query(website.input).getAttribute('placeholder')
      ).toEqual('Enter website address');
    });

    it('should allow up to 100 characters and will stop input on 101st character', () => {
      const { spectator } = testSetup();
      expect(spectator.query(website.input).getAttribute('maxlength')).toEqual(
        '100'
      );
    });
  });

  describe('Primary Brand Color', () => {
    it('should show label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(color.picker).getAttribute('label')).toEqual(
        'Primary Brand Color'
      );
    });

    it('should show color picker', () => {
      const { spectator } = testSetup();
      expect(spectator.query(color.picker)).toBeTruthy();
    });
  });

  describe('Company Logo', () => {
    it('should show label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(logo.label)).toBeTruthy();
      expect(spectator.query(logo.label).textContent).toEqual('Company Logo');
    });

    it('should show upload control', () => {
      const { spectator } = testSetup();
      expect(spectator.query(logo.input)).toBeTruthy();
    });

    it('Logo is optional', () => {
      //Arrange
      const { component, spectator } = testSetup();

      //Act
      component.form.setValue({
        ...component.form.value,
        LogoMediaLink: null,
      });
      spectator.detectComponentChanges();

      //Assert
      expect(component.form.valid).toBeTruthy();
    });

    it('Should display text when an logo is not selected "File size must be less than 10MB."', () => {
      //Arrange
      const { spectator } = testSetup();

      const fileSizeMessageEl = spectator.query(
        byText('File size must be less than 10MB.', {
          selector: '.custom-img-upload-reqs',
        })
      );

      //Assert
      expect(fileSizeMessageEl).toBeVisible();
    });
  });

  describe('Favicon', () => {
    it('should show label', () => {
      const { spectator } = testSetup();
      expect(spectator.query(favicon.label)).toBeTruthy();
      expect(spectator.query(favicon.label).textContent).toEqual('Favicon');
    });

    it('should show upload control', () => {
      const { spectator } = testSetup();
      expect(spectator.query(favicon.input)).toBeTruthy();
    });

    it('Favicon is optional', () => {
      //Arrange
      const { component, spectator } = testSetup();

      //Act
      component.form.setValue({
        ...component.form.value,
        IconMediaLink: null,
      });
      spectator.detectComponentChanges();

      //Assert
      expect(component.form.valid).toBeTruthy();
    });

    it('Should display text when an image is not selected "Square images are recommended, all others will be resized automatically. Image should be minimum of 50px X 50px and under 2MB in size"', () => {
      //Arrange
      const { spectator } = testSetup();

      const fileSizeMessageEl = spectator.query(
        byText(
          'Square images are recommended, all others will be resized automatically. Image should be minimum of 50px X 50px and under 2MB in size.',
          {
            selector: '.custom-img-upload-reqs',
          }
        )
      );

      //Assert
      expect(fileSizeMessageEl).toBeVisible();
    });
  });

  describe('Website', () => {
    it('should display company display label', () => {
      //Arrange
      const { spectator } = testSetup();
      const label = spectator.query(
        byText('Website', {
          selector: '.cos-form-field-label > cos-label',
        })
      );

      //Assert
      expect(label).toBeVisible();
    });

    it('should company website field be optional', () => {
      //Arrange
      const { component, spectator } = testSetup();

      //Act
      component.form.setValue({
        ...component.form.value,
        Website: {
          Url: '',
          IsPrimary: false,
          Type: null,
        } as any,
      });
      spectator.detectComponentChanges();

      //Assert
      expect(component.form.valid).toBeTruthy();
    });

    it('should display invalid website error when url entered is invalid (ex-"anything@anything")', () => {
      //Arrange
      const { component, spectator } = testSetup();

      // Act
      const control = component.form.get('Website.Url');

      const websiteField = spectator.query('input#companyWebsite');
      spectator.typeInElement('anything@anything', websiteField);

      websiteField.dispatchEvent(new Event('blur'));
      spectator.detectChanges();

      const errorEl = spectator.query(
        byText('The Website url is invalid.', {
          selector: '.cos-error',
        })
      );

      //Assert
      expect(control.valid).toBeFalsy();
      expect(errorEl).toBeVisible();
      expect(component.form.valid).toBeFalsy();
    });

    it('should display invalid website error when url entered is "abc.d"', () => {
      //Arrange
      const { component, spectator } = testSetup();

      // Act
      const control = component.form.get('Website.Url');

      const websiteField = spectator.query('input#companyWebsite');
      spectator.typeInElement('abc.d', websiteField);

      websiteField.dispatchEvent(new Event('blur'));
      spectator.detectChanges();

      const errorEl = spectator.query(
        byText('The Website url is invalid.', {
          selector: '.cos-error',
        })
      );

      //Assert
      expect(control.valid).toBeFalsy();
      expect(errorEl).toBeVisible();
      expect(component.form.valid).toBeFalsy();
    });

    it('should not display invalid website error when valid url entered (ex-"abc.def")', () => {
      //Arrange
      const { component, spectator } = testSetup();

      // Act
      const control = component.form.get('Website.Url');

      const websiteField = spectator.query('input#companyWebsite');
      spectator.typeInElement('abc.def', websiteField);

      websiteField.dispatchEvent(new Event('blur'));
      spectator.detectChanges();

      const errorEl = spectator.query(
        byText('The Website url is invalid.', {
          selector: '.cos-error',
        })
      );

      //Assert
      expect(control.valid).toBeTruthy();
      expect(errorEl).not.toBeVisible();
      expect(component.form.valid).toBeTruthy();
    });

    it('should form be valid if website url is valid(ex-"company.domain.com")', () => {
      //Arrange
      const { component, spectator } = testSetup();

      // Act
      const control = component.form.get('Website.Url');
      control.setValue('company.domain.com');
      spectator.detectComponentChanges();

      //Assert
      expect(control.valid).toBeTruthy();
      expect(component.form.valid).toBeTruthy();
    });

    it('should website field have maxlength 100', () => {
      //Arrange
      const { spectator } = testSetup();

      // Act
      const websiteField = spectator.query('input#companyWebsite');

      //Assert
      expect(websiteField).toHaveAttribute('maxlength', '100');
    });
  });
});
