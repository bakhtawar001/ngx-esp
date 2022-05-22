import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';

import {
  AsiCompanyAvatarComponent,
  AsiCompanyAvatarModule,
} from './company-avatar.component';

const selectors = {
  logoImage: dataCySelector('logo-img'),
  avatarImage: dataCySelector('avatar-img'),
  icon: dataCySelector('icon'),
};

describe('CompanyAvatarComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiCompanyAvatarComponent,
    imports: [AsiCompanyAvatarModule],
    detectChanges: false,
  });

  const testSetup = (customer?: any, showAvatarIcon?: boolean) => {
    const spectator = createComponent();
    const component = spectator.component;

    component.customer = customer;
    component.showAvatarIcon = showAvatarIcon || false;

    return { spectator, component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('should show avatar when project customer has IconImageUrl defined and showAvatarIcon set to true', () => {
    const { spectator } = testSetup({ IconImageUrl: 'testUrl' }, true);

    spectator.detectChanges();

    const logoImage = spectator.query(selectors.avatarImage);
    expect(logoImage?.getAttribute('src')).toEqual('testUrl');
  });

  it('should show avatar when project customer has IconImageUrl defined and showAvatarIcon set to false', () => {
    const { spectator } = testSetup({ IconImageUrl: 'testUrl' }, false);

    spectator.detectChanges();

    const logoImage = spectator.query(selectors.logoImage);
    expect(logoImage?.getAttribute('src')).toEqual('testUrl');
  });

  it('should show users icon when project customer IconImageUrl is not defined', () => {
    const { spectator } = testSetup({ IconImageUrl: '' }, false);

    spectator.detectChanges();

    expect(spectator.query(selectors.logoImage)).toBeFalsy();
    expect(spectator.query(selectors.avatarImage)).toBeFalsy();
    expect(spectator.query(selectors.icon)?.children[0].className).toContain(
      'fas fa-users'
    );
  });
});
