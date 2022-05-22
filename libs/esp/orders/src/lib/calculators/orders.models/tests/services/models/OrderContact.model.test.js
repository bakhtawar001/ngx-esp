(function () {
  'use strict';

  describe('OrderContact Model', function () {
    var mockOrderContact,
      mockContact,
      mockAddress,
      OrderContact,
      Contact,
      Address;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_OrderContact_, _Contact_, _Address_) {
      OrderContact = _OrderContact_;
      Contact = _Contact_;
      Address = _Address_;

      mockOrderContact = new OrderContact();
      mockContact = new Contact({ Name: 'Test Contact' });
      mockAddress = new Address({ Name: 'Test Address', Line1: 'Test Line1' });
    }));

    it('setParty', function () {
      mockOrderContact.setParty(mockContact);
      expect(mockOrderContact.Party.Name).toEqual('Test Contact');

      mockOrderContact.setParty({ Name: 'Test Contact', IsPerson: true });
      expect(mockOrderContact.Party.Name).toEqual('Test Contact');
      expect(mockOrderContact.Party.IsPerson).toBeTruthy();
      expect(mockOrderContact.Party.IsCompany).toBeFalsy();

      mockOrderContact.setParty({ Name: 'Test Contact', IsCompany: true });
      expect(mockOrderContact.Party.Name).toEqual('Test Contact');
      expect(mockOrderContact.Party.IsCompany).toBeTruthy();
      expect(mockOrderContact.Party.IsPerson).toBeFalsy();

      mockOrderContact.setParty({ Name: 'Test Contact' });
      expect(mockOrderContact.Party).toBeUndefined();
    });

    it('setAddress', function () {
      mockOrderContact.setAddress(mockAddress);
      expect(mockOrderContact.Address.Name).toEqual('Test Address');
      expect(mockOrderContact.Address.Line1).toEqual('Test Line1');

      mockOrderContact.setAddress({
        Name: 'Test Address',
        Line1: 'Test Line1',
      });
      expect(mockOrderContact.Address.Name).toEqual('Test Address');
      expect(mockOrderContact.Address.Line1).toEqual('Test Line1');
    });

    it('reset', function () {
      mockOrderContact.setParty(mockContact);
      mockOrderContact.setAddress(mockAddress);
      mockOrderContact.reset();

      expect(mockOrderContact.Name).toEqual('');
      expect(mockOrderContact.Party).toBeUndefined();
      expect(mockOrderContact.Address.Name).not.toEqual('Test Address');
      expect(mockOrderContact.Address.Line1).not.toEqual('Test Line1');
    });
  });
})();
