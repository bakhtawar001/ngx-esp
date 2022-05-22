import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ContactRolePillsComponent,
  ContactRolePillsModule,
} from './contact-role-pills.component';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator';
import { CosPillModule } from '@cosmos/components/pill';
import { Company, Contact } from '@esp/models';

const selectors = {
  rolePill: dataCySelector('role-pill'),
};

describe('ContactRolePillsComponent', () => {
  const createComponent = createComponentFactory({
    component: ContactRolePillsComponent,
    imports: [ContactRolePillsModule, CosPillModule],
  });

  const testSetup = (
    options = {
      Company: {
        AcknowledgementContact: {
          Id: 1,
        },
        BillingContact: {
          Id: 1,
        },
        ShippingContact: {
          Id: 1,
        },
      },
      contactId: 1,
    }
  ) => {
    const spectator = createComponent();

    spectator.setInput('contactId', options.contactId);
    spectator.setInput('company', options.Company as Company);

    spectator.detectComponentChanges();

    const component = spectator.component;

    return { spectator, component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('Should display all pills in proper order', () => {
    const { spectator, component } = testSetup();
    expect(spectator.queryAll(selectors.rolePill).length).toEqual(3);
    expect(spectator.queryAll(selectors.rolePill)[0]).toContainText(
      component.allowedRolesKeys.BillingContact
    );
    expect(spectator.queryAll(selectors.rolePill)[1]).toContainText(
      component.allowedRolesKeys.AcknowledgementContact
    );
    expect(spectator.queryAll(selectors.rolePill)[2]).toContainText(
      component.allowedRolesKeys.ShippingContact
    );
  });

  it('Should display only BillingContact pill', () => {
    const { spectator, component } = testSetup({
      Company: {
        BillingContact: {
          Id: 1,
        },
      } as Company,
      contactId: 1,
    });
    expect(spectator.queryAll(selectors.rolePill).length).toEqual(1);
    expect(spectator.queryAll(selectors.rolePill)[0]).toContainText(
      component.allowedRolesKeys.BillingContact
    );
  });

  it('Should display only AcknowledgementContact pill', () => {
    const { spectator, component } = testSetup({
      Company: {
        AcknowledgementContact: {
          Id: 1,
        },
      } as Company,
      contactId: 1,
    });
    expect(spectator.queryAll(selectors.rolePill).length).toEqual(1);
    expect(spectator.queryAll(selectors.rolePill)[0]).toContainText(
      component.allowedRolesKeys.AcknowledgementContact
    );
  });

  it('Should display only ShippingContact pill', () => {
    const { spectator, component } = testSetup({
      Company: {
        ShippingContact: {
          Id: 1,
        },
      } as Company,
      contactId: 1,
    });
    expect(spectator.queryAll(selectors.rolePill).length).toEqual(1);
    expect(spectator.queryAll(selectors.rolePill)[0]).toContainText(
      component.allowedRolesKeys.ShippingContact
    );
  });

  it('Should not display any pill', () => {
    const { spectator } = testSetup({
      Company: {
        AcknowledgementContact: {
          Id: 1,
        },
        BillingContact: {
          Id: 1,
        },
        ShippingContact: {
          Id: 1,
        },
      },
      contactId: 3,
    });
    expect(spectator.queryAll(selectors.rolePill).length).toEqual(0);
  });
});
