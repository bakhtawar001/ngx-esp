(function () {
  'use strict';

  // GET /api/v1/designs/{id} – detail
  // POST/PUT /designs/{id} – add or update
  // DELETE /designs/{id} – delete

  /*
   * GET /api/v1/designs/search - allows all the normal search functionaliy.
   * Currently has aggregation for tag and allows filtering by “Tags” and “Owners” (userIDs)
   * Will return a search view that’s not identical to what we store and what the detail views are like.
   */
  angular.module('core.models').factory('Design', Design);

  Design.$inject = [
    '$modelFactory',
    'httpInterceptor',
    'growlFactory',
    'DesignLocation',
    'Party',
    '$http',
    '$q',
    'Product',
    'Order',
    'userFactory',
    '$state',
    'LineItem',
  ];

  function Design(
    $modelFactory,
    httpInterceptor,
    growlFactory,
    DesignLocation,
    Party,
    $http,
    $q,
    Product,
    Order,
    userFactory,
    $state,
    LineItem
  ) {
    var model = $modelFactory('designs', {
      pk: 'Id',
      map: {
        Party: Party,
        Locations: DesignLocation.List,
      },
      defaults: {
        Id: 0,
        Name: '',
        ProductId: 0,
        Tags: [],
      },
      actions: {
        base: {
          headers: {},
          interceptor: httpInterceptor,
        },
        post: {
          beforeRequest: preSave,
        },
        update: {
          beforeRequest: preSave,
        },
        query: {
          url: 'search',
          cache: false,
          wrap: false,
        },
        delete: {},
      },
      deleteDesigns: function (ids) {
        var options = {
          data: ids,
          headers: {
            'Content-Type': 'application/json',
          },
        };

        return $http
          .delete('/api/v1/designs', options)
          .then(function () {
            growlFactory.success('Successfully deleted designs');

            return $q.resolve();
          })
          .catch(function () {
            growlFactory.error();
          });
      },
      createOrder: createOrder,
      getDesignById: function (id) {
        var req = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          url: '/api/v1/designs/' + id,
        };
        return $http(req);
      },
      updateDesign: function (params) {
        var req = {
          method: 'PUT',
          url: '/api/v1/designs/' + params.Id,
          headers: {
            'Content-Type': 'application/json',
          },
          data: params,
        };
        return $http(req);
      },
      instance: {
        share: function (params) {
          var emailObj = angular.copy(params);

          emailObj.To = mapEmails(emailObj.To);
          emailObj.Cc = mapEmails(emailObj.Cc);
          emailObj.Bcc = mapEmails(emailObj.Bcc);
          emailObj.ReplyTo = mapEmails(emailObj.ReplyTo);

          function mapEmails(arr) {
            return (
              arr &&
              arr.map(function (obj) {
                return typeof obj === 'string' ? obj : obj.Email;
              })
            );
          }

          var req = {
            method: 'POST',
            url: '/api/v1/designs/' + emailObj.DesignId + '/share',
            data: emailObj,
          };

          return $http(req);
        },
      },
    });

    return model;

    function preSave(instance) {
      var i;

      if (angular.isDefined(instance.data.Locations)) {
        for (i = instance.data.Locations.length - 1; i >= 0; i--) {
          instance.data.Locations[i].Json = angular.toJson(
            instance.data.Locations[i].Json
          );
        }
      }

      if (angular.isDefined(instance.data.Tags) && instance.data.Tags.length) {
        instance.data.Tags = instance.data.Tags.map(function (tag) {
          return typeof tag === 'string' ? tag : tag.text;
        });
      }
    }

    function createOrder(design, customer) {
      try {
        var orderObject = {
          Type: 'order',
          Salespersons: [
            {
              Id: userFactory.currentUser.Id,
            },
          ],
        };

        if (customer) orderObject.Customer = customer;

        var order = new Order(orderObject);

        var isArray = Array.isArray(design);

        var lineItemPromise = isArray
          ? $q.all(design.map(_addProduct))
          : _addProduct(design);

        return lineItemPromise
          .then(_appendLineItems.bind(this, order, isArray))
          .then(_saveOrder);
      } catch (e) {
        return $q.reject();
      }
    }

    function _addProduct(design) {
      return Product.get({
        Id: design.ProductId,
      }).then(_formatProduct.bind(this, design));
    }

    function _formatProduct(design, product) {
      var newLine = new LineItem({
        Type: 'product',
        ProductId: product.Id,
        Name: product.Name,
        Description: product.ShortDescription,
        Number: product.Number,
        ImageUrl: design.Locations[0].Sample.Url,
        Supplier: {
          ExternalId: product.Supplier.Id,
          Name: product.Supplier.Name,
          AsiNumber: product.Supplier.AsiNumber,
          IsAsiMember: true,
        },
      });

      newLine.Decorations = [];
      newLine.Variants = [];

      return $q.resolve(newLine);
    }

    function _appendLineItems(order, isArray, lineItems) {
      if (isArray) {
        lineItems.forEach(_appendLineItems.bind(this, order, false));
      } else {
        order.addLineItem(lineItems);
      }

      return $q.resolve(order);
    }

    function _saveOrder(order) {
      return order
        .$save()
        .then(function (res) {
          $state.go('orders.detail', {
            id: res.Id,
          });
        })
        .catch(function (error) {
          growlFactory.error();
        })
        .finally(function () {
          return $q.resolve();
        });
    }
  }
})();
