import { FormGroup } from '@angular/forms';
import {
  AsiCompanyInfoFormComponent,
  AsiCompanyInfoFormComponentModule,
} from '../company-info-form';
import { dataCySelector } from '@cosmos/testing';
import {
  AsiCompanyBrandInformationFormComponent,
  AsiCompanyBrandInformationFormModule,
} from '../company-brand-information-form';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import {
  AsiCompanyFormComponent,
  AsiCompanyFormComponentModule,
} from './company-form.component';

const infoForm = {
  section: 'asi-company-info-form',
};

const brandInfo = {
  toggleButton: dataCySelector('toggle-brand-info'),
  toggleIcon: dataCySelector('toggle-brand-info') + ' .fa',
  section: dataCySelector('brand-information'),
};

describe('CompanyFormComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiCompanyFormComponent,
    imports: [AsiCompanyFormComponentModule],
    overrideModules: [
      [
        AsiCompanyInfoFormComponentModule,
        {
          set: {
            declarations: [MockComponent(AsiCompanyInfoFormComponent)],
            exports: [MockComponent(AsiCompanyInfoFormComponent)],
          },
        },
      ],
      [
        AsiCompanyBrandInformationFormModule,
        {
          set: {
            declarations: [
              MockComponent(AsiCompanyBrandInformationFormComponent),
            ],
            exports: [MockComponent(AsiCompanyBrandInformationFormComponent)],
          },
        },
      ],
    ],
    detectChanges: false,
  });

  const testSetup = () => {
    const spectator = createComponent();
    const component = spectator.component;

    component.form = new FormGroup({
      CompanyInformation: new FormGroup({}),
      BrandInformation: new FormGroup({}),
    }) as any;

    spectator.detectChanges();

    return { spectator, component };
  };

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  it('should display asi-company-info-form', () => {
    const { spectator } = testSetup();

    expect(spectator.query(infoForm.section)).toBeTruthy();
  });

  describe('Brand Information section', () => {
    it('should expand section with brand fields', () => {
      const { spectator } = testSetup();

      expect(spectator.query(brandInfo.section)).toBeFalsy();

      spectator.click(brandInfo.toggleButton);
      spectator.detectChanges();

      expect(spectator.query(brandInfo.section)).toBeTruthy();
    });

    it('should display label in expanded state', () => {
      const { spectator, component } = testSetup();
      component.showBrandInfo = true;
      spectator.detectComponentChanges();

      expect(spectator.query(brandInfo.toggleIcon)?.classList).toContain(
        'fa-minus'
      );
      expect(
        spectator.query(brandInfo.toggleButton)?.textContent?.trim()
      ).toEqual('Brand Information');
    });

    it('should collapse section with brand fields', () => {
      const { spectator, component } = testSetup();
      component.showBrandInfo = true;
      spectator.detectComponentChanges();

      expect(spectator.query(brandInfo.section)).toBeTruthy();

      spectator.click(brandInfo.toggleButton);
      spectator.detectChanges();

      expect(spectator.query(brandInfo.section)).toBeFalsy();
    });

    it('should display label in collapsed state', () => {
      const { spectator, component } = testSetup();
      component.showBrandInfo = false;
      spectator.detectComponentChanges();

      expect(spectator.query(brandInfo.toggleIcon)?.classList).toContain(
        'fa-plus'
      );
      expect(
        spectator.query(brandInfo.toggleButton)?.textContent?.trim()
      ).toEqual('Brand Information');
    });
  });
});
