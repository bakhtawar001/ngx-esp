/* eslint-disable no-console */
(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('Contact', Contact);

  Contact.$inject = ['$http', '$q', '$modelFactory', 'httpInterceptor', 'growlFactory', 'Address', 'Phone', 'EmailAddress', 'Website', 'LinkRelationship', 'singleRequestService'];

  function Contact($http, $q, $modelFactory, httpInterceptor, growlFactory, Address, Phone, EmailAddress, Website, LinkRelationship, singleRequestService) {
    var model = $modelFactory('contacts', {
      pk: 'Id',
      map: {
        Addresses: Address.List,
        Phones: Phone.List,
        Emails: EmailAddress.List,
        Websites: Website.List,
        Links: LinkRelationship.List
      },
      defaults: {
        GivenName: '',
        FamilyName: '',
        Phones: [],
        Emails: [],
        Addresses: [],
        Websites: [],
        Tags: [],
        Links: [],
        IsUser: false,
        IsPerson: true,
        IsProspect: false
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

          if (!instance.Websites.length) {
            instance.addWebsite();
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
            growlFactory.success();
          }
        },
        'update': {
          beforeRequest: function () {
            beforeRequestCleanup(this.data);
          },
          afterRequest: function (response) {
            growlFactory.success();
          }
        },
        'canDelete': {
          method: 'GET',
          url: '{Id}/validatedelete',
          cache: false,
          wrap: false
        },
        'getContactUser': {
          method: 'GET',
          url: '{Id}',
          cache: false,
          wrap: false
        },
        'merge': {
          method: 'POST',
          url: '{Id}/mergeto/{TargetId}',
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
          resetPrimary(this.Addresses);

          item.IsPrimary = true;
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
            item = new Phone(options);
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
          resetPrimary(this.Phones);

          item.IsPrimary = true;
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
          removeItemAndSetPrimary(this.Emails, item);
        },
        getPrimaryEmail: function () {
          return getPrimary(this.Emails);
        },
        setPrimaryEmail: function (item) {
          resetPrimary(this.Emails);
          if (item) {
            item.IsPrimary = true;
          }
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
          removeItemAndSetPrimary(this.Websites, item);
        },
        getPrimaryWebsite: function () {
          return getPrimary(this.Websites);
        },
        setPrimaryWebsite: function (item) {
          resetPrimary(this.Websites);

          item.IsPrimary = true;
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
              url: '/api/v1/contacts/' + this.Id + '/links',
              data: item
            };

            if (item.Id > 0) {
              req.method = 'PUT';
              req.url += '/' + item.Id;

              isNew = false;
            }

            return $http(req)
              .then(function (res) {
                var wrapped = new LinkRelationship(res.data);

                if (isNew) {
                  instance.addLink(wrapped);
                }

                growlFactory.success();

                return $q.resolve(wrapped);
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
              .delete('/api/v1/contacts/' + instance.Id + '/links/' + item.Id)
              .then(function (resp) {
                instance.Links.splice(instance.Links.indexOf(item), 1);

                growlFactory.success();
              })
              .catch(function (res) {
                growlFactory.error(res.data);

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

        toString: function () {
          return (this.GivenName + ' ' + this.FamilyName).trim();
        }
      },
      bulkSearchUpdate: function (type, value, searchData) {
        return $http({
          method: 'PUT',
          url: '/api/v1/contacts/bulkSearch/' + type,
          params: { args: value },
          data: searchData
        });
      },
      query: singleRequestService.getMethod('/api/v1/contacts/search'),
      updateStatus: function (ids, status) {
        return $http.put('/api/v1/contacts/bulk/status?args=' + status, ids);
      },
      updateOwner: function (ids, ownerId) {
        return $http.put('/api/v1/contacts/bulk/owner?args=' + ownerId, ids);
      },
      updateVisibility: function (ids, visibility) {
        return $http.put('/api/v1/contacts/bulk/visibility?args=' + visibility, ids);
      },
      Address: Address,
      Phone: Phone,
      EmailAddress: EmailAddress,
      Website: Website,
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

      // Remove any emails missing address.
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

      // Websites
      // {
      hasPrimary = false;

      // Remove any emails missing address.
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

      if (angular.isDefined(data.Tags) && data.Tags.length) {
        data.Tags = data.Tags.map(function (tag) { return (typeof tag === 'string') ? tag : tag.text; });
      }
    }

    return model;
  }
})();
