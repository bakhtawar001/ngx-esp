(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('Company', Company);

  Company.$inject = ['$http', '$window', '$q', '$modelFactory', 'httpInterceptor', 'growlFactory', 'Contact', 'Address', 'Phone', 'EmailAddress', 'Website', 'ShippingAccount', 'LinkRelationship', 'Tax', 'TaxCertificate', 'singleRequestService'];

  function Company($http, $window, $q, $modelFactory, httpInterceptor, growlFactory, Contact, Address, Phone, EmailAddress, Website, ShippingAccount, LinkRelationship, Tax, TaxCertificate, singleRequestService) {
    var smartlinkUrlPrefix = $window.asi && $window.asi.smartLinkUrl;

    var model = $modelFactory('companies', {
      pk: 'Id',
      map: {
        Addresses: Address.List,
        Phones: Phone.List,
        Emails: EmailAddress.List,
        Websites: Website.List,
        ShippingAccounts: ShippingAccount.List,
        Links: LinkRelationship.List,
        TaxCertificates: TaxCertificate.List,
        TaxCode: Tax
      },
      defaults: {
        Name: '',
        Phones: [],
        Emails: [],
        EmailDomains: [],
        Addresses: [],
        Websites: [],
        Tags: [],
        Links: [],
        BillingContact: null,
        ShippingContact: null,
        AcknowledgementContact: null,
        Currency: 'USD',
        ShippingAccounts: [],
        CreditTerms: [],
        PaymentMethods: [],
        CreditLimit: 0,
        DefaultDiscount: 0,
        IsCustomer: true,
        IsCompany: true,
        IsSupplier: false,
        IsDecorator: false,
        IsProspect: false,
        IsTaxExempt: false,
        CanEditVisibility: true
      },
      init: function (instance) {
        if (!instance.Id) {
          if (!instance.Addresses.length) {
            instance.addAddress();
          }

          if (!instance.Phones.length) {
            instance.addPhone();
          }

          if (!instance.Emails.length) {
            instance.addEmail();
          }

          if (!instance.EmailDomains.length) {
            instance.addEmailDomain();
          }

          if (!instance.Websites.length) {
            instance.addWebsite();
          }

          if (!instance.ShippingAccounts.length) {
            instance.addShippingAccount();
          }
        }
      },
      actions: {
        'base': {
          interceptor: httpInterceptor
        },
        'post': {
          beforeRequest: function () {
            beforeRequestCleanup(this.data);
          },
          afterRequest: function (response) {
            if (!this.data.HideGrowl) {
              growlFactory.success();
            }
          }
        },
        'update': {
          beforeRequest: function () {
            beforeRequestCleanup(this.data);
          },
          afterRequest: function (response) {
            if (!this.data.HideGrowl) {
              growlFactory.success();
            }
          }
        },
        'personifyEmails': {
          method: 'GET',
          url: smartlinkUrlPrefix + '/companies/{Id}/emails.json',
          override: true,
          cache: false,
          wrap: false,
          interceptor: {
            responseError: function () { }
          }
        },
        'credit': {
          method: 'GET',
          url: 'credit/asi/{AsiNumber}',
          cache: false,
          wrap: false,
          interceptor: {}
        },
        'canDelete': {
          method: 'GET',
          url: '{Id}/validatedelete',
          cache: false,
          wrap: false
        },
        'presentations': {
          method: 'GET',
          url: '{Id}/presentations{?params*}',
          cache: false,
          wrap: false
        }
      },
      instance: {
        addAddress: function (options) {
          var item;

          if (options instanceof Address) {
            item = options;
          } else {
            item = new Address(options);
          }

          addItem(this.Addresses, item);
          if (item.Type === 'BLNG') {
            this.setBillingAddress(item);
          }
        },
        removeAddress: function (item) {
          removeItemAndSetPrimary(this.Addresses, item);
        },
        getPrimaryAddress: function () {
          return getPrimary(this.Addresses);
        },
        setPrimaryAddress: function (item) {
          if (item) {
            resetPrimary(this.Addresses);
            item.IsPrimary = true;
          }
        },
        getBillingAddress: function () {
          return getBilling(this.Addresses);
        },
        setBillingAddress: function (item) {
          resetBilling(this.Addresses);

          item.Type = 'BLNG';
        },


        addPhone: function (options) {
          var item;

          if (options instanceof Phone) {
            item = options;
          } else {
            item = new Phone(angular.merge({ Type: 'Office' }, options));
          }

          addItem(this.Phones, item);
        },
        removePhone: function (item) {
          removeItemAndSetPrimary(this.Phones, item);
        },
        getPrimaryPhone: function () {
          return getPrimary(this.Phones);
        },
        setPrimaryPhone: function (item) {
          if (item) {
            resetPrimary(this.Phones);
            item.IsPrimary = true;
          }
        },


        addEmail: function (options) {
          var item;

          if (options instanceof EmailAddress) {
            item = options;
          } else {
            item = new EmailAddress(options);
          }

          addItem(this.Emails, item);
        },
        removeEmail: function (item) {
          if (item) {
            removeItemAndSetPrimary(this.Emails, item);
          }
        },
        getPrimaryEmail: function () {
          return getPrimary(this.Emails);
        },
        setPrimaryEmail: function (item) {
          if (item) {
            resetPrimary(this.Emails);
            item.IsPrimary = true;
          }
        },
        setPersonifyEmails: setPersonifyEmails,


        addEmailDomain: function (domain) {
          if (typeof domain === 'string' || angular.isUndefined(domain)) {
            this.EmailDomains.push(domain);
          }
        },
        removeEmailDomain: function (item) {
          console.warn('Not implemented - remove by index');
        },


        addWebsite: function (options) {
          var item;

          if (options instanceof Website) {
            item = options;
          } else {
            item = new Website(options);
          }

          addItem(this.Websites, item);
        },
        removeWebsite: function (item) {
          if (item) {
            removeItemAndSetPrimary(this.Websites, item);
          }
        },
        getPrimaryWebsite: function () {
          return getPrimary(this.Websites);
        },
        setPrimaryWebsite: function (item) {
          if (item) {
            resetPrimary(this.Websites);
            item.IsPrimary = true;
          }
        },


        addCreditTerm: function (creditTerm) {
          if (typeof creditTerm === 'string' || angular.isDefined(creditTerm)) {
            this.CreditTerms.push(creditTerm);
          }
        },
        removeCreditTerm: function (item) {
          console.warn('Not implemented - remove by index');
        },


        addPaymentMethod: function (paymentMethod) {
          if (typeof paymentMethod === 'string' || angular.isDefined(paymentMethod)) {
            this.PaymentMethods.push(paymentMethod);
          }
        },
        removePaymentMethod: function (item) {
          console.warn('Not implemented - remove by index');
        },


        addShippingAccount: function (options) {
          var item;

          if (options instanceof ShippingAccount) {
            item = options;
          } else {
            item = new ShippingAccount(options);
          }

          this.ShippingAccounts.push(item);
        },
        removeShippingAccount: function (item) {
          removeItemAndSetPrimary(this.ShippingAccounts, item);
        },
        getPrimaryShippingAccount: function () {
          return getPrimary(this.ShippingAccounts);
        },
        setPrimaryShippingAccount: function (item) {
          if (item) {
            resetPrimary(this.ShippingAccounts);
            item.IsPrimary = true;
          }
        },

        addLink: function (options) {
          var item;

          if (options instanceof LinkRelationship) {
            item = options;
          } else {
            item = new LinkRelationship(options);
          }

          this.Links.push(item);
        },

        saveLink: function (item) {
          if (this.Id && item) {
            var instance = this;
            var isNew = true;

            var req = {
              method: 'POST',
              url: '/api/v1/companies/' + this.Id + '/links',
              data: item
            };

            if (item.Id > 0) {
              req.method = 'PUT';
              req.url += '/' + item.Id;

              isNew = false;
            }

            return $http(req)
              .then(function (res) {
                if (typeof item.$update === 'function') {
                  item.$update(new LinkRelationship(res.data));
                } else {
                  item = new LinkRelationship(res.data);
                }

                if (isNew) {
                  instance.addLink(item);
                }

                growlFactory.success();

                return $q.resolve(item);
              })
              .catch(function (res) {
                growlFactory.error();

                return $q.reject(res);
              });
          }
        },

        removeLink: function (item) {
          var instance = this;

          if (instance.Id && item && item.Id) {
            return $http
              .delete('/api/v1/companies/' + instance.Id + '/links/' + item.Id)
              .then(function (resp) {
                instance.Links.splice(instance.Links.indexOf(item), 1);

                if (angular.isDefined(instance.BillingContact) && instance.BillingContact && instance.BillingContact.Id === item.To.Id)
                  instance.BillingContact = null;
                if (angular.isDefined(instance.ShippingContact) && instance.ShippingContact && instance.ShippingContact.Id === item.To.Id)
                  instance.ShippingContact = null;
                if (angular.isDefined(instance.AcknowledgementContact) && instance.AcknowledgementContact && instance.AcknowledgementContact.Id === item.To.Id)
                  instance.AcknowledgementContact = null;

                growlFactory.success();
              })
              .catch(function (res) {
                growlFactory.error();

                return $q.reject(res);
              });
          }
        },

        getPersonLinks: function () {
          return this.Links.getPersonLinks(this.Id);
        },

        getCompanyLinks: function () {
          return this.Links.getCompanyLinks(this.Id);
        },

        getRoles: function () {
          var roles = [];

          if (this.IsCustomer) {
            roles.push('Customer');
          }
          if (this.IsDecorator) {
            roles.push('Decorator');
          }
          if (this.IsProspect) {
            roles.push('Prospect');
          }
          if (this.IsSupplier) {
            roles.push('Supplier');
          }

          return roles.join(', ');
        },

        toString: function () {
          return (this.Name).trim();
        },
        hasTypes: function () {
          return this.IsCustomer || this.IsSupplier || this.IsDecorator || this.IsProspect;
        }
      },
      bulkSearchUpdate: function (type, value, searchData) {
        return $http({
          method: 'PUT',
          url: '/api/v1/companies/bulkSearch/' + type,
          params: { args: value },
          data: searchData
        });
      },
      query: singleRequestService.getMethod('/api/v1/companies/search'),
      updateStatus: function (ids, status) {
        return $http.put('/api/v1/companies/bulk/status?args=' + status, ids);
      },
      updateOwner: function (ids, ownerId) {
        return $http.put('/api/v1/companies/bulk/owner?args=' + ownerId, ids);
      },
      updateVisibility: function (ids, visibility) {
        return $http.put('/api/v1/companies/bulk/visibility?args=' + visibility, ids);
      },
      getDistributor: function (id) {
        return $http.get('/api/v1/supplier/purchaseorders/email/' + id);
      },
      getTenantReplyToEmail: function (id) {
        return $http.get('/api/v1/settings/distributor/' + id);
      },
      getTenantReplyToEmailForOrder: function (id) {
        return $http.get('/api/v1/settings/distributor/order/' + id);
      },
      getCustomerContacts: function (id) {
        return $http.get('/api/v1/companies/' + id);
      },
      Address: Address,
      Phone: Phone,
      EmailAddress: EmailAddress,
      Website: Website,
      ShippingAccount: ShippingAccount,
      LinkRelationship: LinkRelationship,
      beforeRequestCleanup: beforeRequestCleanup
    });

    function resetPrimary(array) {
      for (var i = 0; i < array.length; i++) {
        if (angular.isDefined(array[i].IsPrimary)) {
          array[i].IsPrimary = false;
        }
      }
    }

    function resetBilling(array) {
      for (var i = 0; i < array.length; i++) {
        if (angular.isDefined(array[i].Type)) {
          array[i].Type = 'GNRL';
        }
      }
    }

    function getPrimary(array) {
      var result;

      for (var i = 0; i < array.length; i++) {
        if (angular.isDefined(array[i].IsPrimary) && array[i].IsPrimary) {
          result = array[i];
          break;
        }
      }

      return result;
    }
    function getBilling(array) {
      var result;
      for (var i = 0; i < array.length; i++) {
        if (array[i].Type === 'BLNG') {
          result = array[i];
          break;
        }
      }
      return result;
    }

    function setPersonifyEmails(externalEmails) {
      var supplier = this;

      supplier.HasExternalEmails = true;

      if (externalEmails && externalEmails.length) {
        externalEmails.forEach(addEmail);
      }

      function addEmail(email, isDefault) {
        var matchingEmail = supplier.Emails.filter(function (e) { return e.Address === email && !e.Type; });

        if (!matchingEmail.length) {
          supplier.addEmail({ Address: email, Type: '' });
        }
      }
    }

    function addItem(array, item) {
      if (angular.isDefined(item)) {
        if (item.IsPrimary) {
          resetPrimary(array);
        } else if (!array.length) {
          item.IsPrimary = true;
        }

        array.push(item);
      }
    }

    function removeItemAndSetPrimary(array, item) {
      if (angular.isDefined(item)) {
        array.splice(array.indexOf(item), 1);

        if (angular.isDefined(item.IsPrimary) && item.IsPrimary && array.length) {
          resetPrimary(array);

          array[0].IsPrimary = true;
        }
      }
    }

    function beforeRequestCleanup(data) {
      var hasPrimary,
        i;

      // Addresses
      // {
      hasPrimary = false;

      // Remove any addresses missing address.
      for (i = data.Addresses.length - 1; i >= 0; i--) {
        if (data.Addresses[i].isUndefined()) {
          data.Addresses.splice(i, 1);
        } else if (data.Addresses[i].IsPrimary) {
          hasPrimary = true;
        }
      }

      // Set first record to primary
      if (!hasPrimary && data.Addresses.length) {
        data.Addresses[0].IsPrimary = true;
      }
      // }

      // Phones
      // {
      hasPrimary = false;

      // Remove any phones missing numbers.
      for (i = data.Phones.length - 1; i >= 0; i--) {
        if (angular.isUndefined(data.Phones[i].Number) || !data.Phones[i].Number.length) {
          data.Phones.splice(i, 1);
        } else if (data.Phones[i].IsPrimary) {
          hasPrimary = true;
        }
      }

      // Set first record to primary
      if (!hasPrimary && data.Phones.length) {
        data.Phones[0].IsPrimary = true;
      }
      // }

      // Emails
      // {
      hasPrimary = false;

      // Remove any emails missing address.
      for (i = data.Emails.length - 1; i >= 0; i--) {
        if (data.Emails[i].isUndefined()) {
          data.Emails.splice(i, 1);
        } else if (data.Emails[i].IsPrimary) {
          hasPrimary = true;
        }
      }

      // Set first record to primary
      if (!hasPrimary && data.Emails.length) {
        data.Emails[0].IsPrimary = true;
      }
      // }

      // Email Domains
      // {
      // Remove any email domains missing domain.
      for (i = data.EmailDomains.length - 1; i >= 0; i--) {
        if (!data.EmailDomains[i] || !data.EmailDomains[i].length) {
          data.EmailDomains.splice(i, 1);
        }
      }
      // }

      // Websites
      // {
      hasPrimary = false;

      // Remove any undefined websites.
      for (i = data.Websites.length - 1; i >= 0; i--) {
        if (data.Websites[i].isUndefined()) {
          data.Websites.splice(i, 1);
        } else if (data.Websites[i].IsPrimary) {
          hasPrimary = true;
        }
      }

      // Set first record to primary
      if (!hasPrimary && data.Websites.length) {
        data.Websites[0].IsPrimary = true;
      }
      // }

      // Credit Terms
      // {
      // Remove any blank credit terms.
      for (i = data.CreditTerms.length - 1; i >= 0; i--) {
        if (angular.isUndefined(data.CreditTerms[i]) || data.CreditTerms[i] === null) {
          data.CreditTerms.splice(i, 1);
        }
      }
      // }

      // Payment Methods
      // {
      // Remove any blank payment methods.
      for (i = data.PaymentMethods.length - 1; i >= 0; i--) {
        if (angular.isUndefined(data.PaymentMethods[i]) || !data.PaymentMethods[i]) {
          data.PaymentMethods.splice(i, 1);
        }
      }
      // }

      // Shipping Accounts
      // {
      // hasPrimary = false;

      // Remove any emails missing address.
      for (i = data.ShippingAccounts.length - 1; i >= 0; i--) {
        if (data.ShippingAccounts[i].isUndefined()) {
          data.ShippingAccounts.splice(i, 1);
          // } else if (data.ShippingAccounts[i].IsPrimary) {
          //    hasPrimary = true;
        }
      }

      // Set first record to primary
      // if (!hasPrimary && data.ShippingAccounts.length) {
      //    data.ShippingAccounts[0].IsPrimary = true;
      // }
      // }

      // TaxCode
      // {
      if (angular.isDefined(data.TaxCode) && (!data.TaxCode || angular.isUndefined(data.TaxCode.Name) || !data.TaxCode.Name.length || !data.TaxCode.Components || !data.TaxCode.Components.length)) {
        delete data.TaxCode;
      }
      // }
    }

    return model;
  }
})();
