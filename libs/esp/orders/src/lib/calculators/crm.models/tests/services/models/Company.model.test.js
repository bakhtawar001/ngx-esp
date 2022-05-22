(function () {
  'use strict';

  describe('Company Model', function () {
    var mockCompany,
      $httpBackend,
      $q,
      Company;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Company_, _$httpBackend_, _$q_) {
      Company = _Company_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;

      mockCompany = new Company();

      spyOn(console, 'warn');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('init', function () {
      expect(mockCompany.Addresses.length).toEqual(1);
      expect(mockCompany.Addresses[0].IsPrimary).toBeTruthy();

      expect(mockCompany.Phones.length).toEqual(1);
      expect(mockCompany.Phones[0].IsPrimary).toBeTruthy();

      expect(mockCompany.Emails.length).toEqual(1);
      expect(mockCompany.Emails[0].IsPrimary).toBeTruthy();

      expect(mockCompany.EmailDomains.length).toEqual(1);

      expect(mockCompany.Websites.length).toEqual(1);
      expect(mockCompany.Websites[0].IsPrimary).toBeTruthy();

      expect(mockCompany.ShippingAccounts.length).toEqual(1);
    });

    it('addAddress', function () {
      addAddress({ Name: 'Test' });
      addAddress(new Company.Address({ Name: 'Test' }));
      addAddress({ Name: 'Test' });
      expect(mockCompany.Addresses.length).toEqual(4);
    });

    it('addAddress Primary', function () {
      addAddress({ Name: 'Test', IsPrimary: true });
      addAddress(new Company.Address({ Name: 'Test', IsPrimary: true }));
      addAddress({ Name: 'Test', IsPrimary: true });
      expect(mockCompany.Addresses.length).toEqual(4);
    });

    it('removeAddress', function () {
      mockCompany.removeAddress(mockCompany.Addresses[0]);

      expect(mockCompany.Addresses.length).toEqual(0);

      addAddress(new Company.Address({ Name: 'Test' }));
      addAddress(new Company.Address({ Name: 'Test', IsPrimary: true }));

      mockCompany.removeAddress(mockCompany.Addresses[1]);

      expect(mockCompany.Addresses.length).toEqual(1);
      expect(mockCompany.Addresses[0].IsPrimary).toBeTruthy();
    });

    it('getPrimaryAddress', function () {
      var primaryAddress = mockCompany.getPrimaryAddress();

      expect(primaryAddress.IsPrimary).toBeTruthy();
    });

    it('setPrimaryAddress', function () {
      var primaryAddress = mockCompany.getPrimaryAddress();

      expect(primaryAddress.IsPrimary).toBeTruthy();

      addAddress({ Name: 'Test', IsPrimary: true });

      expect(primaryAddress.IsPrimary).toBeFalsy();

      mockCompany.setPrimaryAddress(primaryAddress);

      expect(primaryAddress.IsPrimary).toBeTruthy();
    });

    it('addPhone', function () {
      addPhone({ Number: '1111111111' });
      addPhone(new Company.Phone({ Number: '2222222222' }));
      addPhone({ Number: '3333333333' });
      expect(mockCompany.Phones.length).toEqual(4);
      expect(mockCompany.Phones[0].Type).toEqual('Office');
    });

    it('addPhone Primary', function () {
      addPhone({ Number: '1111111111', IsPrimary: true });
      addPhone(new Company.Phone({ Number: '2222222222', IsPrimary: true }));
      addPhone({ Number: '3333333333', IsPrimary: true });
      expect(mockCompany.Phones.length).toEqual(4);
    });

    it('removePhone', function () {
      mockCompany.removePhone(mockCompany.Phones[0]);

      expect(mockCompany.Phones.length).toEqual(0);

      addPhone(new Company.Phone({ Number: '2222222222' }));
      addPhone(new Company.Phone({ Number: '2222222222', IsPrimary: true }));

      mockCompany.removePhone(mockCompany.Phones[1]);

      expect(mockCompany.Phones.length).toEqual(1);
      expect(mockCompany.Phones[0].IsPrimary).toBeTruthy();
    });

    it('getPrimaryPhone', function () {
      var primaryPhone = mockCompany.getPrimaryPhone();

      expect(primaryPhone.IsPrimary).toBeTruthy();
    });

    it('setPrimaryPhone', function () {
      var primaryPhone = mockCompany.getPrimaryPhone();

      expect(primaryPhone.IsPrimary).toBeTruthy();

      addPhone({ Number: '1111111111', IsPrimary: true });

      expect(primaryPhone.IsPrimary).toBeFalsy();

      mockCompany.setPrimaryPhone(primaryPhone);

      expect(primaryPhone.IsPrimary).toBeTruthy();
    });

    it('addEmail', function () {
      addEmail({ Address: 'test1@test1.com' });
      addEmail(new Company.EmailAddress({ Address: 'test2@test2.com' }));
      addEmail({ Address: 'test3@test3.com' });
      expect(mockCompany.Emails.length).toEqual(4);
    });

    it('addEmail Primary', function () {
      addEmail({ Address: 'test1@test1.com', IsPrimary: true });
      addEmail(new Company.EmailAddress({ Address: 'test2@test2.com', IsPrimary: true }));
      addEmail({ Address: 'test3@test3.com', IsPrimary: true });
      expect(mockCompany.Emails.length).toEqual(4);
    });

    it('removeEmail', function () {
      mockCompany.removeEmail(mockCompany.Emails[0]);

      expect(mockCompany.Emails.length).toEqual(0);

      addEmail(new Company.EmailAddress({ Address: 'test2@test2.com' }));
      addEmail(new Company.EmailAddress({ Address: 'test2@test2.com', IsPrimary: true }));

      mockCompany.removeEmail(mockCompany.Emails[1]);

      expect(mockCompany.Emails.length).toEqual(1);
      expect(mockCompany.Emails[0].IsPrimary).toBeTruthy();
    });

    it('getPrimaryEmail', function () {
      var primaryEmail = mockCompany.getPrimaryEmail();

      expect(primaryEmail.IsPrimary).toBeTruthy();
    });

    it('setPrimaryEmail', function () {
      var primaryEmail = mockCompany.getPrimaryEmail();

      expect(primaryEmail.IsPrimary).toBeTruthy();

      addEmail({ Address: 'test@test.com', IsPrimary: true });

      expect(primaryEmail.IsPrimary).toBeFalsy();

      mockCompany.setPrimaryEmail(primaryEmail);

      expect(primaryEmail.IsPrimary).toBeTruthy();
    });

    it('setPersonifyEmails', function () {
      var email1 = { Address: 'test1@test1.com', IsPrimary: true };
      var email2 = { Address: 'test2@test2.com', Type: 'Orders' };
      var email3 = { Address: 'test3@test3.com' };

      mockCompany.setPersonifyEmails([email1, email2, email3]);

      expect(mockCompany.Emails.length).toEqual(4);
    });

    it('addEmailDomain', function () {
      expect(mockCompany.EmailDomains.length).toEqual(1);

      mockCompany.addEmailDomain('http://www.asicentral.com');

      expect(mockCompany.EmailDomains.length).toEqual(2);

      mockCompany.addEmailDomain({});

      expect(mockCompany.EmailDomains.length).toEqual(2);
    });

    it('removeEmailDomain', function () {
      mockCompany.removeEmailDomain();
      expect(console.warn).toHaveBeenCalledWith('Not implemented - remove by index');
    });

    it('addWebsite', function () {
      addWebsite({ Url: 'http://www.asicentral.com' });
      addWebsite(new Company.Website({ Url: 'http://www.asicentral.com' }));
      addWebsite({ Url: 'http://www.asicentral.com' });
      expect(mockCompany.Websites.length).toEqual(4);
    });

    it('addWebsite Primary', function () {
      addWebsite({ Url: 'http://www.asicentral.com', IsPrimary: true });
      addWebsite({ Url: 'http://www.asicentral.com', IsPrimary: true });
      addWebsite({ Url: 'http://www.asicentral.com', IsPrimary: true });
      expect(mockCompany.Websites.length).toEqual(4);
    });

    it('removeWebsite', function () {
      mockCompany.removeWebsite(mockCompany.Websites[0]);

      expect(mockCompany.Websites.length).toEqual(0);
    });

    it('getPrimaryWebsite', function () {
      var primaryWebsite = mockCompany.getPrimaryWebsite();

      expect(primaryWebsite.IsPrimary).toBeTruthy();
    });

    it('setPrimaryWebsite', function () {
      var primaryWebsite = mockCompany.getPrimaryWebsite();

      expect(primaryWebsite.IsPrimary).toBeTruthy();

      addWebsite({ Url: 'http://www.asicentral.com', IsPrimary: true });

      expect(primaryWebsite.IsPrimary).toBeFalsy();

      mockCompany.setPrimaryWebsite(primaryWebsite);

      expect(primaryWebsite.IsPrimary).toBeTruthy();
    });

    it('addCreditTerm', function () {
      mockCompany.addCreditTerm('Test');

      expect(mockCompany.CreditTerms.length).toEqual(1);

      mockCompany.addCreditTerm({});

      expect(mockCompany.CreditTerms.length).toEqual(2);
    });

    it('removeCreditTerm', function () {
      mockCompany.removeCreditTerm();
      expect(console.warn).toHaveBeenCalledWith('Not implemented - remove by index');
    });

    it('addPaymentMethod', function () {
      mockCompany.addPaymentMethod('Test');

      expect(mockCompany.PaymentMethods.length).toEqual(1);

      mockCompany.addPaymentMethod({});

      expect(mockCompany.PaymentMethods.length).toEqual(2);
    });

    it('removePaymentMethod', function () {
      mockCompany.removePaymentMethod();
      expect(console.warn).toHaveBeenCalledWith('Not implemented - remove by index');
    });

    it('addShippingAccount', function () {
      mockCompany.addShippingAccount({ Number: '1111111111' });
      mockCompany.addShippingAccount(new Company.ShippingAccount({ Number: '2222222222' }));
      mockCompany.addShippingAccount({ Number: '3333333333' });
      expect(mockCompany.ShippingAccounts.length).toEqual(4);
    });

    it('removeShippingAccount', function () {
      mockCompany.removeShippingAccount(mockCompany.ShippingAccounts[0]);

      expect(mockCompany.ShippingAccounts.length).toEqual(0);
    });

    it('getPrimaryShippingAccount', function () {
      var primary = mockCompany.getPrimaryShippingAccount();
      expect(angular.isUndefined(primary)).toBeTruthy();
    });

    it('setPrimaryShippingAccount', function () {
      mockCompany.setPrimaryShippingAccount(mockCompany.ShippingAccounts[0]);
      expect(mockCompany.ShippingAccounts[0].IsPrimary).toBeTruthy();
    });

    it('addLink', function () {
      mockCompany.addLink({ Comment: 'Test' });
      mockCompany.addLink(new Company.LinkRelationship({ Comment: 'Test' }));
      mockCompany.addLink({ Comment: 'Test' });
      expect(mockCompany.Links.length).toEqual(3);
    });

    it('getPersonLinks', function () {
      mockCompany.addLink({ Comment: 'Test' });
      mockCompany.addLink({ Comment: 'Test', To: { IsPerson: true } });
      mockCompany.addLink({ Comment: 'Test', To: { IsCompany: true } });
      expect(mockCompany.getPersonLinks().length).toEqual(1);
    });

    it('getCompanyLinks', function () {
      mockCompany.addLink({ Comment: 'Test' });
      mockCompany.addLink({ Comment: 'Test', To: { IsPerson: true } });
      mockCompany.addLink({ Comment: 'Test', To: { IsCompany: true } });
      expect(mockCompany.getCompanyLinks().length).toEqual(1);
    });

    it('getRoles', function () {
      mockCompany.IsCustomer = true;
      mockCompany.IsDecorator = true;
      mockCompany.IsProspect = true;
      mockCompany.IsSupplier = true;
      expect(mockCompany.getRoles()).toEqual('Customer, Decorator, Prospect, Supplier');
    });

    it('toString', function () {
      mockCompany.Name = 'Test       ';
      expect(mockCompany.toString()).toEqual('Test');
    });

    it('bulkSearchUpdate', function () {
      var type = 'status',
        status = true,
        searchData = {
          term: '',
          etc: '...'
        };

      Company.bulkSearchUpdate(type, status, searchData);

      $httpBackend
        .expect('PUT', '/api/v1/companies/bulkSearch/status?args=true', searchData)
        .respond(200);
      $httpBackend.flush();
    });

    it('updateStatus', function () {
      var ids = [1, 2, 3, 4, 5, 6, 7],
        status = 'active';
      Company.updateStatus(ids, status);
      $httpBackend
        .expectPUT('/api/v1/companies/bulk/status?args=' + status, ids)
        .respond(200);
      $httpBackend.flush();
    });

    it('updateOwner', function () {
      var ids = [1, 2, 3, 4, 5, 6, 7],
        ownerId = 1948;
      Company.updateOwner(ids, ownerId);
      $httpBackend
        .expectPUT('/api/v1/companies/bulk/owner?args=' + ownerId, ids)
        .respond(200);
      $httpBackend.flush();
    });

    it('updateVisibility', function () {
      var ids = [1, 2, 3, 4, 5, 6, 7],
        visibility = '';
      Company.updateVisibility(ids, visibility);
      $httpBackend
        .expectPUT('/api/v1/companies/bulk/visibility?args=' + visibility, ids)
        .respond(200);
      $httpBackend.flush();
    });

    describe('BeforeRequestCleanup', function () {
      it('Addresses', function () {
        addAddress(new Company.Address({
          Name: 'ASI', Line1: '4800 E Street Rd', City: 'Trevose', State: 'PA', PostalCode: '19053'
        }));
        addAddress(new Company.Address({
          Name: 'ASI', Line1: '4800 E Street Rd', City: 'Trevose', State: 'PA', PostalCode: '19053', IsPrimary: true
        }));

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.Addresses.length).toEqual(2);

        // Remove Address manually so no Primary is set.
        mockCompany.Addresses.splice(mockCompany.Addresses.indexOf(mockCompany.Addresses[1]), 1);

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.Addresses.length).toEqual(1);
        expect(mockCompany.Addresses[0].IsPrimary).toBeTruthy();
      });

      it('Phones', function () {
        addPhone(new Company.Phone({ Number: '1111111111' }));
        addPhone(new Company.Phone({ Number: '1111111111', IsPrimary: true }));

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.Phones.length).toEqual(2);

        mockCompany.Phones.splice(mockCompany.Phones.indexOf(mockCompany.Phones[1]), 1);

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.Phones.length).toEqual(1);
        expect(mockCompany.Phones[0].IsPrimary).toBeTruthy();
      });

      it('Emails', function () {
        addEmail(new Company.EmailAddress({ Address: 'test@test.com' }));
        addEmail(new Company.EmailAddress({ Address: 'test@test.com', IsPrimary: true }));

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.Emails.length).toEqual(2);

        mockCompany.Emails.splice(mockCompany.Emails.indexOf(mockCompany.Emails[1]), 1);

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.Emails.length).toEqual(1);
        expect(mockCompany.Emails[0].IsPrimary).toBeTruthy();
      });

      it('Email Domains', function () {
        mockCompany.addEmailDomain('http://www.asicentral.com');

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.EmailDomains.length).toEqual(1);

        mockCompany.EmailDomains.splice(mockCompany.EmailDomains.indexOf(mockCompany.EmailDomains[0]), 1);

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.EmailDomains.length).toEqual(0);
      });

      it('Websites', function () {
        addWebsite(new Company.Website({
          Url: 'http://www.asicentral.com'
        }));

        addWebsite(new Company.Website({
          Url: 'http://www.asicentral.com', IsPrimary: true
        }));

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.Websites.length).toEqual(2);

        mockCompany.Websites.splice(mockCompany.Websites.indexOf(mockCompany.Websites[1]), 1);

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.Websites.length).toEqual(1);
        expect(mockCompany.Websites[0].IsPrimary).toBeTruthy();
      });

      it('Credit Terms', function () {
        mockCompany.addCreditTerm('Test');
        Company.beforeRequestCleanup(mockCompany);
        expect(mockCompany.CreditTerms.length).toEqual(1);
        mockCompany.CreditTerms.splice(mockCompany.CreditTerms.indexOf(mockCompany.CreditTerms[0]), 1);
        Company.beforeRequestCleanup(mockCompany);
        expect(mockCompany.CreditTerms.length).toEqual(0);

        mockCompany.addCreditTerm(null);
        Company.beforeRequestCleanup(mockCompany);
        expect(mockCompany.CreditTerms.length).toEqual(0);
      });

      it('Payment Methods', function () {
        mockCompany.addPaymentMethod('Test');
        Company.beforeRequestCleanup(mockCompany);
        expect(mockCompany.PaymentMethods.length).toEqual(1);
        mockCompany.PaymentMethods.splice(mockCompany.PaymentMethods.indexOf(mockCompany.PaymentMethods[0]), 1);
        Company.beforeRequestCleanup(mockCompany);
        expect(mockCompany.PaymentMethods.length).toEqual(0);
        mockCompany.addPaymentMethod('');
        Company.beforeRequestCleanup(mockCompany);
        expect(mockCompany.PaymentMethods.length).toEqual(0);
      });

      it('Shipping Accounts', function () {
        mockCompany.addShippingAccount({ Number: '1111111111' });

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.ShippingAccounts.length).toEqual(1);

        mockCompany.ShippingAccounts.splice(mockCompany.ShippingAccounts.indexOf(mockCompany.ShippingAccounts[0]), 1);

        Company.beforeRequestCleanup(mockCompany);

        expect(mockCompany.ShippingAccounts.length).toEqual(0);
      });
    });

    function addAddress(address) {
      var addressCount = mockCompany.Addresses.length,
        primaryAddress = mockCompany.getPrimaryAddress();

      mockCompany.addAddress(address);

      var newAddress = mockCompany.Addresses[mockCompany.Addresses.length - 1];

      expect(mockCompany.Addresses.length).toEqual(addressCount + 1);

      expect(newAddress.Name).toEqual(address.Name);

      if (address.IsPrimary) {
        if (primaryAddress) {
          expect(primaryAddress.IsPrimary).toBeFalsy();
        }
        expect(newAddress.IsPrimary).toBeTruthy();
      }
    }

    function addPhone(phone) {
      var phoneCount = mockCompany.Phones.length,
        primaryPhone = mockCompany.getPrimaryPhone();

      mockCompany.addPhone(phone);

      var newPhone = mockCompany.Phones[mockCompany.Phones.length - 1];

      expect(mockCompany.Phones.length).toEqual(phoneCount + 1);

      expect(newPhone.Number).toEqual(phone.Number);

      if (phone.IsPrimary) {
        if (primaryPhone) {
          expect(primaryPhone.IsPrimary).toBeFalsy();
        }
        expect(newPhone.IsPrimary).toBeTruthy();
      }
    }

    function addEmail(email) {
      var emailCount = mockCompany.Emails.length,
        primaryEmail = mockCompany.getPrimaryEmail();

      mockCompany.addEmail(email);

      var newEmail = mockCompany.Emails[mockCompany.Emails.length - 1];

      expect(mockCompany.Emails.length).toEqual(emailCount + 1);

      expect(newEmail.Address).toEqual(email.Address);

      if (email.IsPrimary) {
        if (primaryEmail) {
          expect(primaryEmail.IsPrimary).toBeFalsy();
        }
        expect(newEmail.IsPrimary).toBeTruthy();
      }
    }

    function addWebsite(website) {
      var websiteCount = mockCompany.Websites.length,
        primaryWebsite = mockCompany.getPrimaryWebsite();

      mockCompany.addWebsite(website);

      var newWebsite = mockCompany.Websites[mockCompany.Websites.length - 1];

      expect(mockCompany.Websites.length).toEqual(websiteCount + 1);

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
