import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CosToastService } from '@cosmos/components/notification';
import { dataCySelector } from '@cosmos/testing';
import { PARTY_LOCAL_STATE } from '@esp/parties';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { AddressListPanelFormModule } from '../../../settings/forms/address-list-panel';
import { AddressListPanelForm } from '../../../settings/forms/address-list-panel/address-list-panel.form';
import { ContactDetailLocalState } from '../../local-states';
import {
  ContactDetailComponent,
  ContactDetailComponentModule,
} from './contact-detail.component';

const selectors = {
  profileAndContact: {
    panel: dataCySelector('profile-and-contact-panel'),
    header: dataCySelector('profile-and-contact-panel-header'),
    phoneList:
      dataCySelector('profile-and-contact-panel') +
      ' ' +
      dataCySelector('phone-list-panel-row-form'),
  },
  companies: {
    panel: dataCySelector('companies-panel'),
    header: dataCySelector('companies-panel-header'),
  },
  addresses: dataCySelector('contact-addresses'),
  contactLinks: dataCySelector('contact-links'),
};

describe('ContactDetailComponent', () => {
  const createComponent = createComponentFactory({
    component: ContactDetailComponent,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      ContactDetailComponentModule,
    ],
    providers: [mockProvider(CosToastService)],
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
    ],
  });

  const testSetup = () => {
    const stateMock = {
      connect: () => of(this),
      party: { IsEditable: true },
      partyIsReady: true,
    };
    const spectator = createComponent({
      providers: [
        mockProvider(ContactDetailLocalState, stateMock),
        {
          provide: PARTY_LOCAL_STATE,
          useValue: stateMock,
        },
      ],
    });
    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Profile & Contact information', () => {
    it('should contain header', () => {
      const { spectator } = testSetup();

      expect(spectator.query(selectors.profileAndContact.header)).toHaveText(
        'Profile & Contact Information'
      );
    });

    it('should contain panels in order', () => {
      const { spectator } = testSetup();

      const panels = spectator.queryAll(
        `${selectors.profileAndContact.panel} cos-segmented-panel-row`
      );
      expect(panels.length).toBe(4);
      expect(panels[0].textContent.trim()).toContain('Name');
      expect(panels[1].textContent.trim()).toContain('Profile Photo');
      expect(panels[2].textContent.trim()).toContain('Email');
      expect(panels[3].textContent.trim()).toContain('Telephone Numbers');
    });

    it('should display Mobile Phone as default phone type', () => {
      const { component } = testSetup();

      expect(component.defaultPhoneType).toEqual('Mobile');
    });
  });

  describe('Addresses', () => {
    it('should be displayed', () => {
      const { spectator } = testSetup();

      expect(spectator.query(selectors.addresses)).toBeTruthy();
    });
  });

  describe('Contact links', () => {
    it('should be displayed', () => {
      const { spectator } = testSetup();

      expect(spectator.query(selectors.contactLinks)).toBeTruthy();
    });
  });
});
