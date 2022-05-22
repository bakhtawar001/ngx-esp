(function () {
  'use strict';

  describe('Contact Model', function () {
    var mockContact,
      $httpBackend,
      $q,
      Contact;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Contact_, _$httpBackend_, _$q_) {
      Contact = _Contact_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;

      mockContact = new Contact();
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('init', function () {
      expect(mockContact.Addresses.length).toEqual(1);
      expect(mockContact.Addresses[0].IsPrimary).toBeTruthy();

      expect(mockContact.Phones.length).toEqual(1);
      expect(mockContact.Phones[0].IsPrimary).toBeTruthy();

      expect(mockContact.Emails.length).toEqual(1);
      expect(mockContact.Emails[0].IsPrimary).toBeTruthy();

      expect(mockContact.Websites.length).toEqual(1);
      expect(mockContact.Websites[0].IsPrimary).toBeTruthy();
    });

    it('addAddress', function () {
      addAddress({ Name: 'Test' });
      addAddress(new Contact.Address({ Name: 'Test' }));
      addAddress({ Name: 'Test' });
      expect(mockContact.Addresses.length).toEqual(4);
    });

    it('addAddress Primary', function () {
      addAddress({ Name: 'Test', IsPrimary: true });
      addAddress(new Contact.Address({ Name: 'Test', IsPrimary: true }));
      addAddress({ Name: 'Test', IsPrimary: true });
      expect(mockContact.Addresses.length).toEqual(4);
    });

    it('removeAddress', function () {
      mockContact.removeAddress(mockContact.Addresses[0]);

      expect(mockContact.Addresses.length).toEqual(0);

      addAddress(new Contact.Address({ Name: 'Test' }));
      addAddress(new Contact.Address({ Name: 'Test', IsPrimary: true }));

      mockContact.removeAddress(mockContact.Addresses[1]);

      expect(mockContact.Addresses.length).toEqual(1);
      expect(mockContact.Addresses[0].IsPrimary).toBeTruthy();
    });

    it('getPrimaryAddress', function () {
      var primaryAddress = mockContact.getPrimaryAddress();

      expect(primaryAddress.IsPrimary).toBeTruthy();
    });

    it('setPrimaryAddress', function () {
      var primaryAddress = mockContact.getPrimaryAddress();

      expect(primaryAddress.IsPrimary).toBeTruthy();

      addAddress({ Name: 'Test', IsPrimary: true });

      expect(primaryAddress.IsPrimary).toBeFalsy();

      mockContact.setPrimaryAddress(primaryAddress);

      expect(primaryAddress.IsPrimary).toBeTruthy();
    });

    it('addPhone', function () {
      addPhone({ Number: '1111111111' });
      addPhone(new Contact.Phone({ Number: '2222222222' }));
      addPhone({ Number: '3333333333' });
      expect(mockContact.Phones.length).toEqual(4);
    });

    it('addPhone Primary', function () {
      addPhone({ Number: '1111111111', IsPrimary: true });
      addPhone(new Contact.Phone({ Number: '2222222222', IsPrimary: true }));
      addPhone({ Number: '3333333333', IsPrimary: true });
      expect(mockContact.Phones.length).toEqual(4);
    });

    it('removePhone', function () {
      mockContact.removePhone(mockContact.Phones[0]);

      expect(mockContact.Phones.length).toEqual(0);
    });

    it('getPrimaryPhone', function () {
      var primaryPhone = mockContact.getPrimaryPhone();

      expect(primaryPhone.IsPrimary).toBeTruthy();
    });

    it('setPrimaryPhone', function () {
      var primaryPhone = mockContact.getPrimaryPhone();

      expect(primaryPhone.IsPrimary).toBeTruthy();

      addPhone({ Number: '1111111111', IsPrimary: true });

      expect(primaryPhone.IsPrimary).toBeFalsy();

      mockContact.setPrimaryPhone(primaryPhone);

      expect(primaryPhone.IsPrimary).toBeTruthy();
    });

    it('addEmail', function () {
      addEmail({ Address: 'test1@test1.com' });
      addEmail(new Contact.EmailAddress({ Address: 'test2@test2.com' }));
      addEmail({ Address: 'test3@test3.com' });
      expect(mockContact.Emails.length).toEqual(4);
    });

    it('addEmail Primary', function () {
      addEmail({ Address: 'test1@test1.com', IsPrimary: true });
      addEmail(new Contact.EmailAddress({ Address: 'test2@test2.com', IsPrimary: true }));
      addEmail({ Address: 'test3@test3.com', IsPrimary: true });
      expect(mockContact.Emails.length).toEqual(4);
    });

    it('removeEmail', function () {
      mockContact.removeEmail(mockContact.Emails[0]);

      expect(mockContact.Emails.length).toEqual(0);
    });

    it('getPrimaryEmail', function () {
      var primaryEmail = mockContact.getPrimaryEmail();

      expect(primaryEmail.IsPrimary).toBeTruthy();
    });

    it('setPrimaryEmail', function () {
      var primaryEmail = mockContact.getPrimaryEmail();

      expect(primaryEmail.IsPrimary).toBeTruthy();

      addEmail({ Address: 'test@test.com', IsPrimary: true });

      expect(primaryEmail.IsPrimary).toBeFalsy();

      mockContact.setPrimaryEmail(primaryEmail);

      expect(primaryEmail.IsPrimary).toBeTruthy();
    });

    it('addWebsite', function () {
      addWebsite({ Url: 'http://www.asicentral.com' });
      addWebsite(new Contact.Website({ Url: 'http://www.asicentral.com' }));
      addWebsite({ Url: 'http://www.asicentral.com' });
      expect(mockContact.Websites.length).toEqual(4);
    });

    it('addWebsite Primary', function () {
      addWebsite({ Url: 'http://www.asicentral.com', IsPrimary: true });
      addWebsite(new Contact.Website({ Url: 'http://www.asicentral.com', IsPrimary: true }));
      addWebsite({ Url: 'http://www.asicentral.com', IsPrimary: true });
      expect(mockContact.Websites.length).toEqual(4);
    });

    it('removeWebsite', function () {
      mockContact.removeWebsite(mockContact.Websites[0]);

      expect(mockContact.Websites.length).toEqual(0);
    });

    it('getPrimaryWebsite', function () {
      var primaryWebsite = mockContact.getPrimaryWebsite();

      expect(primaryWebsite.IsPrimary).toBeTruthy();
    });

    it('setPrimaryWebsite', function () {
      var primaryWebsite = mockContact.getPrimaryWebsite();

      expect(primaryWebsite.IsPrimary).toBeTruthy();

      addWebsite({ Url: 'http://www.asicentral.com', IsPrimary: true });

      expect(primaryWebsite.IsPrimary).toBeFalsy();

      mockContact.setPrimaryWebsite(primaryWebsite);

      expect(primaryWebsite.IsPrimary).toBeTruthy();
    });

    it('addLink', function () {
      mockContact.addLink({ Comment: 'Test' });
      mockContact.addLink(new Contact.LinkRelationship({ Comment: 'Test' }));
      mockContact.addLink({ Comment: 'Test' });
      expect(mockContact.Links.length).toEqual(3);
    });

    it('getPersonLinks', function () {
      mockContact.addLink({ Comment: 'Test' });
      mockContact.addLink({ Comment: 'Test', To: { IsPerson: true } });
      mockContact.addLink({ Comment: 'Test', To: { IsCompany: true } });
      expect(mockContact.getPersonLinks().length).toEqual(1);
    });

    it('getCompanyLinks', function () {
      mockContact.addLink({ Comment: 'Test' });
      mockContact.addLink({ Comment: 'Test', To: { IsPerson: true } });
      mockContact.addLink({ Comment: 'Test', To: { IsCompany: true } });
      expect(mockContact.getCompanyLinks().length).toEqual(1);
    });

    it('toString', function () {
      mockContact.GivenName = 'Pradeep';
      mockContact.FamilyName = 'Pola';
      expect(mockContact.toString()).toEqual('Pradeep Pola');
    });

    it('bulkSearchUpdate', function () {
      var type = 'status',
        status = true,
        searchData = {
          term: '',
          etc: '...'
        };

      Contact.bulkSearchUpdate(type, status, searchData);

      $httpBackend
        .expect('PUT', '/api/v1/contacts/bulkSearch/status?args=true', searchData)
        .respond(200);

      $httpBackend.flush();
    });

    it('updateStatus', function () {
      var ids = [1, 2, 3, 4, 5, 6, 7],
        status = 'active';
      Contact.updateStatus(ids, status);
      $httpBackend
        .expectPUT('/api/v1/contacts/bulk/status?args=' + status, ids)
        .respond(200);
      $httpBackend.flush();
    });

    it('updateOwner', function () {
      var ids = [1, 2, 3, 4, 5, 6, 7],
        ownerId = 1948;
      Contact.updateOwner(ids, ownerId);
      $httpBackend
        .expectPUT('/api/v1/contacts/bulk/owner?args=' + ownerId, ids)
        .respond(200);
      $httpBackend.flush();
    });

    it('updateVisibility', function () {
      var ids = [1, 2, 3, 4, 5, 6, 7],
        visibility = '';
      Contact.updateVisibility(ids, visibility);
      $httpBackend
        .expectPUT('/api/v1/contacts/bulk/visibility?args=' + visibility, ids)
        .respond(200);
      $httpBackend.flush();
    });

    describe('BeforeRequestCleanup', function () {
      it('Addresses', function () {
        addAddress(new Contact.Address({
          Name: 'ASI', Line1: '4800 E Street Rd', City: 'Trevose', State: 'PA', PostalCode: '19053'
        }));

        addAddress(new Contact.Address({
          Name: 'ASI', Line1: '4800 E Street Rd', City: 'Trevose', State: 'PA', PostalCode: '19053', IsPrimary: true
        }));

        Contact.beforeRequestCleanup(mockContact);

        expect(mockContact.Addresses.length).toEqual(2);

        // Remove Address manually so no Primary is set.
        mockContact.Addresses.splice(mockContact.Addresses.indexOf(mockContact.Addresses[1]), 1);

        Contact.beforeRequestCleanup(mockContact);

        expect(mockContact.Addresses.length).toEqual(1);
        expect(mockContact.Addresses[0].IsPrimary).toBeTruthy();
      });

      it('Phones', function () {
        addPhone(new Contact.Phone({ Number: '1111111111' }));
        addPhone(new Contact.Phone({ Number: '1111111111', IsPrimary: true }));

        Contact.beforeRequestCleanup(mockContact);

        expect(mockContact.Phones.length).toEqual(2);

        mockContact.Phones.splice(mockContact.Phones.indexOf(mockContact.Phones[1]), 1);

        Contact.beforeRequestCleanup(mockContact);

        expect(mockContact.Phones.length).toEqual(1);
        expect(mockContact.Phones[0].IsPrimary).toBeTruthy();
      });

      it('Emails', function () {
        addEmail(new Contact.EmailAddress({ Address: 'test@test.com' }));
        addEmail(new Contact.EmailAddress({ Address: 'test@test.com', IsPrimary: true }));

        Contact.beforeRequestCleanup(mockContact);

        expect(mockContact.Emails.length).toEqual(2);

        mockContact.Emails.splice(mockContact.Emails.indexOf(mockContact.Emails[1]), 1);

        Contact.beforeRequestCleanup(mockContact);

        expect(mockContact.Emails.length).toEqual(1);
        expect(mockContact.Emails[0].IsPrimary).toBeTruthy();
      });

      it('Websites', function () {
        addWebsite(new Contact.Website({ Url: 'http://www.asicentral.com' }));
        addWebsite(new Contact.Website({ Url: 'http://www.asicentral.com', IsPrimary: true }));

        Contact.beforeRequestCleanup(mockContact);

        expect(mockContact.Websites.length).toEqual(2);

        mockContact.Websites.splice(mockContact.Websites.indexOf(mockContact.Websites[1]), 1);

        Contact.beforeRequestCleanup(mockContact);

        expect(mockContact.Websites.length).toEqual(1);
        expect(mockContact.Websites[0].IsPrimary).toBeTruthy();
      });

      it('Tags', function () {
        mockContact.Tags = ['tag1', { text: 'tag2' }];
        Contact.beforeRequestCleanup(mockContact);
        expect(mockContact.Tags.length).toEqual(2);
        expect(mockContact.Tags[0]).toEqual('tag1');
        expect(mockContact.Tags[1]).toEqual('tag2');
      });
    });

    function addAddress(address) {
      var addressCount = mockContact.Addresses.length,
        primaryAddress = mockContact.getPrimaryAddress();

      mockContact.addAddress(address);

      var newAddress = mockContact.Addresses[mockContact.Addresses.length - 1];

      expect(mockContact.Addresses.length).toEqual(addressCount + 1);

      expect(newAddress.Name).toEqual(address.Name);

      if (address.IsPrimary) {
        if (primaryAddress) {
          expect(primaryAddress.IsPrimary).toBeFalsy();
        }
        expect(newAddress.IsPrimary).toBeTruthy();
      }
    }

    function addPhone(phone) {
      var phoneCount = mockContact.Phones.length,
        primaryPhone = mockContact.getPrimaryPhone();

      mockContact.addPhone(phone);

      var newPhone = mockContact.Phones[mockContact.Phones.length - 1];

      expect(mockContact.Phones.length).toEqual(phoneCount + 1);

      expect(newPhone.Number).toEqual(phone.Number);

      if (phone.IsPrimary) {
        if (primaryPhone) {
          expect(primaryPhone.IsPrimary).toBeFalsy();
        }
        expect(newPhone.IsPrimary).toBeTruthy();
      }
    }

    function addEmail(email) {
      var emailCount = mockContact.Emails.length,
        primaryEmail = mockContact.getPrimaryEmail();

      mockContact.addEmail(email);

      var newEmail = mockContact.Emails[mockContact.Emails.length - 1];

      expect(mockContact.Emails.length).toEqual(emailCount + 1);

      expect(newEmail.Address).toEqual(email.Address);

      if (email.IsPrimary) {
        if (primaryEmail) {
          expect(primaryEmail.IsPrimary).toBeFalsy();
        }
        expect(newEmail.IsPrimary).toBeTruthy();
      }
    }

    function addWebsite(website) {
      var websiteCount = mockContact.Websites.length,
        primaryWebsite = mockContact.getPrimaryWebsite();

      mockContact.addWebsite(website);

      var newWebsite = mockContact.Websites[mockContact.Websites.length - 1];

      expect(mockContact.Websites.length).toEqual(websiteCount + 1);

      expect(newWebsite.Url).toEqual(website.Url);

      if (website.IsPrimary) {
        if (primaryWebsite) {
          expect(primaryWebsite.IsPrimary).toBeFalsy();
        }
        expect(newWebsite.IsPrimary).toBeTruthy();
      }
    }
  });
})();
