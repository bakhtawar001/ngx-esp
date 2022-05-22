(function () {
  'use strict';

  describe('LinkRelationship Model', function () {
    var mockContact,
      mockCompany,
      mockPersonRelationship,
      mockCompanyRelationship,
      LinkRelationship,
      Contact,
      Company;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_LinkRelationship_, _Company_, _Contact_) {
      LinkRelationship = _LinkRelationship_;
      Company = _Company_;
      Contact = _Contact_;

      mockCompany = new Company({
        Name: 'ASI'
      });

      mockContact = new Contact({
        GivenName: 'John',
        FamilyName: 'Smith',
        Name: 'John Smith'
      });

      mockCompanyRelationship = new LinkRelationship({
        To: mockCompany
      });

      mockPersonRelationship = new LinkRelationship({
        To: mockContact
      });

      spyOn(console, 'warn');
    }));

    describe('Model', function () {
      it('defaults', function () {
        var model = new LinkRelationship();

        expect(model.Reverse).toBeFalsy();
      });

      it('isDefined', function () {
        var isDefined = mockCompanyRelationship.isDefined();
        expect(console.warn).toHaveBeenCalledWith('Not implemented');
      });

      it('isUndefined', function () {
        var isUndefined = mockCompanyRelationship.isUndefined();
        expect(console.warn).toHaveBeenCalledWith('Not implemented');
      });

      describe('getRelationship', function () {
        it('without parent', function () {
          expect(mockCompanyRelationship.getRelationship()).toEqual(undefined);
          expect(mockPersonRelationship.getRelationship()).toEqual(undefined);
        });

        it('company relationship with company as parent', function () {
          var parent = mockCompany;

          mockCompanyRelationship.Type = {
            Code: 'SERVICER',
            Forward: 'provides services to',
            Reverse: 'is a client of'
          };

          expect(mockCompanyRelationship.getRelationship(parent)).toEqual(mockCompanyRelationship.Type.Forward + ' ' + parent.Name);

          mockCompanyRelationship.Reverse = true;

          expect(mockCompanyRelationship.getRelationship(parent)).toEqual(mockCompanyRelationship.Type.Reverse + ' ' + parent.Name);

          delete mockCompanyRelationship.Type;

          expect(mockCompanyRelationship.getRelationship(parent)).toEqual(('unknown relationship ' + parent.Name).trim());
        });

        it('company relationship with contact as parent', function () {
          var parent = mockContact;

          mockCompanyRelationship.Reverse = true;
          mockCompanyRelationship.Type = {
            Code: 'CONTACT',
            Forward: 'is a contact of',
            Reverse: 'is the employer of'
          };
          mockCompanyRelationship.Title = 'Owner';

          expect(mockCompanyRelationship.getRelationship(parent)).toEqual(mockCompanyRelationship.Title);
        });

        it('person relationship with company as parent', function () {
          var parent = mockCompany;

          mockPersonRelationship.Type = {
            Code: 'CONTACT',
            Forward: 'is a contact of',
            Reverse: 'is the employer of'
          };
          mockPersonRelationship.Title = 'Owner';

          expect(mockPersonRelationship.getRelationship(parent)).toEqual(mockPersonRelationship.Title);
        });

        it('person relationship with contact as parent', function () {
          var parent = mockContact;

          mockPersonRelationship.Type = {
            Code: 'PARENT',
            Forward: 'is a parent of',
            Reverse: 'is the child of'
          };

          expect(mockPersonRelationship.getRelationship(parent)).toEqual(mockPersonRelationship.Type.Forward + ' ' + parent.Name);

          mockPersonRelationship.Reverse = true;

          expect(mockPersonRelationship.getRelationship(parent)).toEqual(mockPersonRelationship.Type.Reverse + ' ' + parent.Name);

          delete mockPersonRelationship.Type;

          expect(mockPersonRelationship.getRelationship(parent)).toEqual(('unknown relationship ' + parent.Name).trim());
        });
      });

      describe('isCompanyContactRelationship', function () {
        it('without parent', function () {
          expect(function () { mockCompanyRelationship.isCompanyContactRelationship(); }).toThrow(new Error('LinkRelationship: isCompanyContactRelationship expects an object'));
          expect(function () { mockPersonRelationship.isCompanyContactRelationship(); }).toThrow(new Error('LinkRelationship: isCompanyContactRelationship expects an object'));
        });

        it('company relationship with company as parent', function () {
          var parent = mockCompany;

          expect(mockCompanyRelationship.isCompanyContactRelationship(parent)).toBeFalsy();
        });

        it('company relationship with contact as parent', function () {
          var parent = mockContact;

          expect(mockCompanyRelationship.isCompanyContactRelationship(parent)).toBeTruthy();
        });

        it('person relationship with company as parent', function () {
          var parent = mockCompany;

          expect(mockPersonRelationship.isCompanyContactRelationship(parent)).toBeTruthy();
        });

        it('person relationship with contact as parent', function () {
          var parent = mockContact;

          expect(mockPersonRelationship.isCompanyContactRelationship(parent)).toBeFalsy();
        });
      });
    });

    describe('List', function () {
      var list;

      beforeEach(function () {
        list = new LinkRelationship.List([mockPersonRelationship, mockPersonRelationship, mockCompanyRelationship, mockCompanyRelationship]);
      });

      it('init', function () {
        expect(list.length).toEqual(4);
      });

      it('getPersonLinks', function () {
        var persons = list.getPersonLinks();

        expect(persons.length).toEqual(2);

        angular.forEach(persons, function (person) {
          expect(person.To.IsPerson).toBeTruthy();
          expect(person.To.IsCompany).toBeFalsy();
        });
      });

      it('getCompanyLinks', function () {
        var companies = list.getCompanyLinks();

        expect(companies.length).toEqual(2);

        angular.forEach(companies, function (company) {
          expect(company.To.IsCompany).toBeTruthy();
          expect(company.To.IsPerson).toBeFalsy();
        });
      });
    });
  });
})();
