import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { CosButtonModule } from '@cosmos/components/button';
import {
  UrlToDomainNamePipe,
  UrlToSocialIconPipe,
  WebsiteUrlPipe,
} from '@cosmos/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SuppliersMockDb } from '@smartlink/suppliers/mocks';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosRatingModule } from '@cosmos/components/rating';
import { CosContactInfoComponent } from './contact-info.component';

describe('CosContactInfoComponent', () => {
  const supplier = SuppliersMockDb.suppliers[0];
  let component: CosContactInfoComponent;
  let spectator: Spectator<CosContactInfoComponent>;
  const createComponent = createComponentFactory({
    component: CosContactInfoComponent,
    imports: [
      CommonModule,
      MatDividerModule,
      CosButtonModule,
      CosAttributeTagModule,
      CosRatingModule,
    ],
    declarations: [
      CosContactInfoComponent,
      UrlToDomainNamePipe,
      UrlToSocialIconPipe,
      WebsiteUrlPipe,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component.heading = 'Contact Information';
    component.supplier = supplier;
    component.labels = {
      addTo: 'Add to',
      artwork: 'Artwork',
      email: 'Send a message',
      headquarters: 'Headquarters',
      orders: 'Orders',
      references: 'Independent Distributor References',
      tollFree: 'Toll Free',
    };
    component.contacts = [
      { Name: 'Brandon Brown', Title: 'Vice President' },
      { Name: 'Brandon Mackay', Title: 'President' },
      { Name: 'Chris Duncan', Title: 'Graphic Artist' },
      { Name: 'Lindsey Williams' },
      { Name: 'Lori Holdener', Title: 'Credit Manager' },
      { Name: 'RaNell Lefler', Title: 'CFO' },
      { Name: 'Rosanne Webster', Title: 'CIO' },
    ];
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Social media links', () => {
    it('should not be visble', () => {
      component.socialLinks = false;
      spectator.detectComponentChanges();
      expect(spectator.query('.cos-social-link')).toBeFalsy();
    });

    it('should display facebook, youtube and instagram icons', () => {
      component.supplier.Websites = [
        'http://www.jornik.com',
        'https://www.instagram.com/jornikmfg/?hl=en',
        'https://www.facebook.com/jornik.mfg/',
        'https://www.youtube.com/channel/UCsh1gNdb3LsbthgA9lSVeWw?view_as=subscriber',
      ];
      component.socialLinks = true;
      spectator.detectComponentChanges();
      expect(spectator.query('.fa-facebook-square')).toBeTruthy();
      expect(spectator.query('.fa-instagram-square')).toBeTruthy();
      expect(spectator.query('.fa-youtube-square')).toBeTruthy();
      expect(spectator.query('.fa-linkedin')).toBeFalsy();
      expect(spectator.query('.fa-twitter-square')).toBeFalsy();
    });

    it('should display facebook, youtube and instagram twitter and linkedin icons', () => {
      component.supplier.Websites = [
        'http://www.jornik.com',
        'https://www.instagram.com/jornikmfg/?hl=en',
        'https://www.facebook.com/jornik.mfg/',
        'https://www.twitter.com/jornik.mfg/',
        'https://www.linkedin.com/jornik.mfg/',
        'https://www.youtube.com/channel/UCsh1gNdb3LsbthgA9lSVeWw?view_as=subscriber',
      ];
      component.socialLinks = true;
      spectator.detectComponentChanges();
      expect(spectator.query('.fa-facebook-square')).toBeTruthy();
      expect(spectator.query('.fa-instagram-square')).toBeTruthy();
      expect(spectator.query('.fa-youtube-square')).toBeTruthy();
      expect(spectator.query('.fa-linkedin')).toBeTruthy();
      expect(spectator.query('.fa-twitter-square')).toBeTruthy();
      const socialMediaLinks = spectator.queryAll('.cos-social-links > a');
      socialMediaLinks?.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank');
      });
    });
  });

  describe('Contact Information', () => {
    it('should display primary address correctly', () => {
      const address = spectator.query('.cos-contact-address');
      expect(address.textContent).toContain(
        component.supplier.Addresses.Primary.Street1
      );
      expect(address.textContent).toContain(
        component.supplier.Addresses.Primary.City
      );
      expect(address.textContent).toContain(
        component.supplier.Addresses.Primary.State
      );
      expect(address.textContent).toContain(
        component.supplier.Addresses.Primary.Zip
      );
    });

    it('should display correct office hours', () => {
      const officeHours = spectator.query('.cos-contact-officeHours');
      expect(officeHours.textContent.trim()).toEqual(
        component.supplier.OfficeHours
      );
    });

    it('should display correct toll free number', () => {
      const phoneNumberTollFree = spectator.query('.cos-contact-tollFree-Num');
      expect(phoneNumberTollFree.textContent.trim()).toEqual(
        component.supplier.Phone.TollFree
      );
    });

    it('should display correct primary number', () => {
      const phoneNumberTollFree = spectator.query('.cos-contact-primary-num');
      expect(phoneNumberTollFree.textContent.trim()).toEqual(
        component.supplier.Phone.Primary
      );
    });

    it('should display correct label for phone numbers', () => {
      expect(
        spectator.query('.cos-contact-tollFreeNum-label').textContent.trim()
      ).toContain(component.labels.tollFree);
      expect(
        spectator.query('.cos-contact-primaryNum-label').textContent.trim()
      ).toContain('Primary');
    });

    it('should not display phone icon', () => {
      component.supplier.Phone = null;
      spectator.detectComponentChanges();
      expect(spectator.query('.fa-phone')).toBeFalsy();
    });

    it('should have correct label and value for primary email', () => {
      const primaryEmailLabel = spectator.query('.cos-primary-email-label');
      const primaryEmailValue = spectator.query('.cos-primary-email-value');
      expect(primaryEmailLabel.textContent.trim()).toEqual('Primary');
      expect(primaryEmailValue.textContent.trim()).toEqual(
        component.supplier.Email
      );
    });

    it('should have correct label and value for artwork email', () => {
      const artworkEmailLabel = spectator.query('.cos-artwork-email-label');
      const artworkEmailValue = spectator.query('.cos-artwork-email-value');
      expect(artworkEmailLabel.textContent.trim()).toEqual(
        component.labels.artwork
      );
      expect(artworkEmailValue.textContent.trim()).toEqual(
        component.supplier.Artwork.Email
      );
    });

    it('click on artwork email should have selected email address in the TO field', () => {
      const artworkSelect = spectator.query('.cos-artwork-email-value > a');
      expect(artworkSelect.getAttribute('href')).toBe(
        'mailto:' + component.supplier.Artwork.Email
      );
    });

    it('should have correct label and value for orders email', () => {
      const ordersEmailLabel = spectator.query('.cos-orders-email-label');
      const ordersEmailValue = spectator.query('.cos-orders-email-value');
      expect(ordersEmailLabel.textContent.trim()).toEqual('Orders');
      expect(ordersEmailValue.textContent.trim()).toEqual(
        component.supplier.Orders.Email
      );
    });

    it('should not display email icon', () => {
      component.supplier.Email = null;
      component.supplier.Artwork = null;
      component.supplier.Orders = null;
      spectator.detectComponentChanges();
      expect(spectator.query('.fa-envelope')).toBeFalsy();
    });

    it('should show correct webiste email address', () => {
      component.supplier.Websites = [
        'http://www.snugzusa.com',
        'https://www.linkedin.com/company/snugz-usa',
      ];
      spectator.detectComponentChanges();
      const websiteAddress = spectator.query('.cos-contact-website');
      expect(websiteAddress.textContent.trim()).toEqual(
        component.supplier.Websites[0]
      );
    });

    it('Click on website link should open page on new window', () => {
      component.supplier.Websites = [
        'http://www.snugzusa.com',
        'https://www.linkedin.com/company/snugz-usa',
      ];
      spectator.detectComponentChanges();
      const websiteLink = spectator.query('.cos-contact-website > a');
      expect(websiteLink.getAttribute('target')).toBe('_blank');
    });

    it('should not display website icon', () => {
      component.supplier.Websites = null;
      spectator.detectComponentChanges();
      expect(spectator.query('.fa-globe')).toBeFalsy();
    });

    it('should display primary contact with correct title', () => {
      expect(spectator.query('.primary-contact-title').textContent).toContain(
        component.contacts[0].Title
      );
      expect(spectator.query('.primary-contact-name').textContent).toContain(
        component.contacts[0].Name
      );
    });

    it('should display company contacts', () => {
      const companyContacts = spectator.queryAll('.cos-company-contacts');
      expect(companyContacts.length).toBe(component.contacts.length);
      expect(companyContacts[0].textContent.trim()).toContain(
        component.contacts[0].Name
      );
      expect(companyContacts[0].textContent.trim()).toContain(
        component.contacts[0].Title
      );
    });
  });

  describe('Independent distributor references', () => {
    it('should display correct company name', () => {
      component.references = [
        {
          Id: 110932,
          Name: 'Brandvia Alliance Inc',
          AsiNumber: '145037',
          Phone: '(408) 955-0500',
          Contacts: [{ Name: 'Bobbi Levingston' }],
          Transactions: 99,
        },
      ];
      spectator.detectComponentChanges();
      const companyName = spectator.query('.cos-reference-name');
      expect(companyName.textContent.trim()).toEqual(
        component.references[0].Name
      );
    });

    it('should display correct ASI number', () => {
      component.references = [
        {
          Id: 110932,
          Name: 'Brandvia Alliance Inc',
          AsiNumber: '145037',
          Phone: '(408) 955-0500',
          Contacts: [{ Name: 'Bobbi Levingston' }],
          Transactions: 99,
        },
      ];
      spectator.detectComponentChanges();
      const asiNumber = spectator.query('.cos-reference-asiNum');
      expect(asiNumber.textContent.trim()).toContain(
        component.references[0].AsiNumber
      );
    });

    it('should display correct contact number', () => {
      component.references = [
        {
          Id: 110932,
          Name: 'Brandvia Alliance Inc',
          AsiNumber: '145037',
          Phone: '(408) 955-0500',
          Contacts: [{ Name: 'Bobbi Levingston' }],
          Transactions: 99,
        },
      ];
      spectator.detectComponentChanges();
      const companyPhone = spectator.query('.cos-reference-contact');
      expect(companyPhone.textContent.trim()).toEqual(
        component.references[0].Phone
      );
    });

    it('should display correct contact name', () => {
      component.references = [
        {
          Id: 110932,
          Name: 'Brandvia Alliance Inc',
          AsiNumber: '145037',
          Phone: '(408) 955-0500',
          Contacts: [{ Name: 'Bobbi Levingston' }],
          Transactions: 99,
        },
      ];
      spectator.detectComponentChanges();
      const contactName = spectator.query('.cos-reference-contact-name');
      expect(contactName.textContent.trim()).toEqual(
        component.references[0].Contacts[0].Name
      );
    });
  });
});
