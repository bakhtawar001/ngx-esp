import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { SocialMediaForm, SocialMediaFormModule } from './social-media.form';

const selectors = {
  form: dataCySelector('social-media-form'),
  facebookField: dataCySelector('facebook-field'),
  instagramField: dataCySelector('instagram-field'),
  linkedInField: dataCySelector('linkedin-field'),
  pinterestField: dataCySelector('pinterest-field'),
  twitterField: dataCySelector('twitter-field'),
  otherMediaField: dataCySelector('other-field'),
};

describe('SocialMediaForm', () => {
  const createComponent = createComponentFactory({
    component: SocialMediaForm,
    imports: [SocialMediaFormModule],
  });

  const testSetup = () => {
    const spectator = createComponent();
    return {
      spectator,
      component: spectator.component,
    };
  };

  it('should create', () => {
    const { spectator, component } = testSetup();

    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display fields in following order: Facebook, Instagram, Linkedin, Pinterest, Twitter, Other', () => {
    const { spectator } = testSetup();

    const labels = spectator.queryAll(selectors.form + ' cos-label');
    const inputs = spectator.queryAll(selectors.form + ' input');

    expect(labels[0].textContent.trim()).toEqual('Facebook');
    expect(inputs[0]).toHaveAttribute('formControlName', 'Facebook');

    expect(labels[1].textContent.trim()).toEqual('Instagram');
    expect(inputs[1]).toHaveAttribute('formControlName', 'Instagram');

    expect(labels[2].textContent.trim()).toEqual('LinkedIn');
    expect(inputs[2]).toHaveAttribute('formControlName', 'LinkedIn');

    expect(labels[3].textContent.trim()).toEqual('Pinterest');
    expect(inputs[3]).toHaveAttribute('formControlName', 'Pinterest');

    expect(labels[4].textContent.trim()).toEqual('Twitter');
    expect(inputs[4]).toHaveAttribute('formControlName', 'Twitter');

    expect(labels[5].textContent.trim()).toEqual('Other');
    expect(inputs[5]).toHaveAttribute('formControlName', 'Other');
  });

  describe('facebook field', () => {
    it('should display facebook field', () => {
      const { spectator } = testSetup();

      const fieldPrefix = spectator.query(
        selectors.facebookField + ' .input-prefix'
      );
      const inputField = spectator.query(selectors.facebookField + ' input');

      expect(fieldPrefix).toContainText('www.facebook.com/');
      expect(inputField).toBeVisible();
    });

    it('should change facebook field', () => {
      const { spectator, component } = testSetup();

      const inputField = spectator.query(selectors.facebookField + ' input');

      spectator.typeInElement('123', inputField);
      spectator.detectChanges();

      expect(component.form.value.Facebook).toEqual('123');
    });

    it('should have maxlength equal to 83', () => {
      const { spectator } = testSetup();

      const inputField = spectator.query(selectors.facebookField + ' input');

      expect(inputField).toHaveAttribute('maxlength', '83');
    });
  });

  describe('instagram field', () => {
    it('should display instagram field', () => {
      const { spectator } = testSetup();

      const fieldPrefix = spectator.query(
        selectors.instagramField + ' .input-prefix'
      );
      const inputField = spectator.query(selectors.instagramField + ' input');

      expect(fieldPrefix).toContainText('@');
      expect(inputField).toBeVisible();
    });

    it('should change instagram field', () => {
      const { spectator, component } = testSetup();

      const inputField = spectator.query(selectors.instagramField + ' input');

      spectator.typeInElement('123', inputField);
      spectator.detectChanges();

      expect(component.form.value.Instagram).toEqual('123');
    });

    it('should have maxlength equal to 99', () => {
      const { spectator } = testSetup();

      const inputField = spectator.query(selectors.instagramField + ' input');

      expect(inputField).toHaveAttribute('maxlength', '99');
    });
  });

  describe('LinkedIn field', () => {
    it('should display LinkedIn field', () => {
      const { spectator } = testSetup();

      const fieldPrefix = spectator.query(
        selectors.linkedInField + ' .input-prefix'
      );
      const inputField = spectator.query(selectors.linkedInField + ' input');

      expect(fieldPrefix).toContainText('www.linkedin.com/');
      expect(inputField).toBeVisible();
    });

    it('should change linkedIn field', () => {
      const { spectator, component } = testSetup();

      const inputField = spectator.query(selectors.linkedInField + ' input');

      spectator.typeInElement('123', inputField);
      spectator.detectChanges();

      expect(component.form.value.LinkedIn).toEqual('123');
    });

    it('should have maxlength equal to 83', () => {
      const { spectator } = testSetup();

      const inputField = spectator.query(selectors.linkedInField + ' input');

      expect(inputField).toHaveAttribute('maxlength', '83');
    });
  });

  describe('pinterest field', () => {
    it('should display pinterest field', () => {
      const { spectator } = testSetup();

      const fieldPrefix = spectator.query(
        selectors.pinterestField + ' .input-prefix'
      );
      const inputField = spectator.query(selectors.pinterestField + ' input');

      expect(fieldPrefix).toContainText('@');
      expect(inputField).toBeVisible();
    });

    it('should change pinterest field', () => {
      const { spectator, component } = testSetup();

      const inputField = spectator.query(selectors.pinterestField + ' input');

      spectator.typeInElement('123', inputField);
      spectator.detectChanges();

      expect(component.form.value.Pinterest).toEqual('123');
    });

    it('should have maxlength equal to 99', () => {
      const { spectator } = testSetup();

      const inputField = spectator.query(selectors.pinterestField + ' input');

      expect(inputField).toHaveAttribute('maxlength', '99');
    });
  });

  describe('twitter field', () => {
    it('should display twitter field', () => {
      const { spectator } = testSetup();

      const fieldPrefix = spectator.query(
        selectors.twitterField + ' .input-prefix'
      );
      const inputField = spectator.query(selectors.twitterField + ' input');

      expect(fieldPrefix).toContainText('@');
      expect(inputField).toBeVisible();
    });

    it('should change twitter field', () => {
      const { spectator, component } = testSetup();

      const inputField = spectator.query(selectors.twitterField + ' input');

      spectator.typeInElement('123', inputField);
      spectator.detectChanges();

      expect(component.form.value.Twitter).toEqual('123');
    });

    it('should have maxlength equal to 99', () => {
      const { spectator } = testSetup();

      const inputField = spectator.query(selectors.twitterField + ' input');

      expect(inputField).toHaveAttribute('maxlength', '99');
    });
  });

  describe('other media field', () => {
    it('should display other media field', () => {
      const { spectator } = testSetup();

      const inputField = spectator.query(selectors.otherMediaField + ' input');

      expect(inputField).toHaveAttribute('placeholder', 'Web address');
      expect(inputField).toBeVisible();
    });

    it('should change other media field', () => {
      const { spectator, component } = testSetup();

      const inputField = spectator.query(selectors.otherMediaField + ' input');

      spectator.typeInElement('123', inputField);
      spectator.detectChanges();

      expect(component.form.value.Other).toEqual('123');
    });

    it('should have maxlength equal 100', () => {
      const { spectator } = testSetup();

      const inputField = spectator.query(selectors.otherMediaField + ' input');

      expect(inputField).toHaveAttribute('maxlength', '100');
    });
  });
});
