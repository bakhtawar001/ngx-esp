import {
  Order,
  OrderLineItemDomainModel,
  OrderType,
  ProductLineItemDomainModel,
  ServiceLineItemDomainModel,
} from '@esp/models';
import { isProductLineItem, isServiceLineItem } from './orders.models.LineItem';
import { calculateTotalsWithTaxRate } from './orders.models.LineItemCalculator';
import {
  calculateConvertedProductLineItemTotals,
  calculateProductLineItemTotals,
} from './orders.models.ProductLineItem';
import { calculateConvertedServiceChargeTotals } from './orders.models.ServiceCharge';
import { calculateTaxRate, roundToPlace } from './_shared';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('Order', Order);

  Order.$inject = [
    '$window',
    '$modelFactory',
    '$http',
    '$q',
    '$filter',
    '_',
    'httpInterceptor',
    'growlFactory',
    'OrderContact_XX',
    'LineItem',
    'ProductLineItem_XX',
    'ServiceCharge_XX',
    'TitleLineItem',
    'OrderNote_XX',
    'Instruction',
    'AttachedFile_XX',
    'Payment',
    'Currency',
    'MediaLink_XX',
    'LookupTypes',
    'Product',
    'Company',
    'OrderStatus',
    'shallowCopy',
    'confirmDialog',
    'Task',
    'singleRequestService',
  ];

  var _orderCompanies = [];
  var _validOrderCompanies = [];
  var _validatedLineItems = {};

  function Order(
    $window,
    $modelFactory,
    $http,
    $q,
    $filter,
    _,
    httpInterceptor,
    growlFactory,
    OrderContact,
    LineItem,
    ProductLineItem,
    ServiceCharge,
    TitleLineItem,
    OrderNote,
    Instruction,
    AttachedFile,
    Payment,
    Currency,
    MediaLink,
    LookupTypes,
    Product,
    Company,
    OrderStatus,
    shallowCopy,
    confirmDialog,
    Task,
    singleRequestService
  ) {
    var model = $modelFactory('orders', {
      pk: 'Id',
      map: {
        Date: mapDate,
        InHandsDate: mapDate,
        ShipDate: mapDate,
        LineItems: LineItem.List,
        AttachedFiles: AttachedFile.List,
        Notes: OrderNote.List,
        BillingContact: OrderContact,
        ShippingContact: OrderContact,
        AcknowledgementContact: OrderContact,
        Instructions: Instruction.List,
        Payments: Payment.List,
        Currencies: Currency.List,
        MediaLinks: MediaLink.List,
        Tasks: Task.List,
      },
      defaults: {
        Type: 'order',
        Status: OrderStatus.Default,
        Date: null,
        InHandsDate: null,
        ShipDate: null,
        LineItems: [],
        Notes: [],
        Instructions: [],
        Tags: [],
        Aggregations: {},
        Payments: [],
        IsEditable: true,
        StatusKind: 'Open',
        Discount: 0,
        Totals: {},
        Artwork: [],
        IsBlindShip: false,
        CanEditOrderNumber: true,
        AllProductsConfigured: false,
        Statuses: [],
        ShippingSameAsBilling: false,
        AcknowledgementSameAsBilling: false,
      },
      init: init,
      actions: {
        base: {
          interceptor: httpInterceptor,
        },
        post: {
          beforeRequest: preSave,
          afterRequest: function (response) {},
        },
        update: {
          beforeRequest: preSave,
          afterRequest: function (response) {},
        },
        $toSmartBooks: {
          url: '{Id}/sendto/ASICS_Smartbooks',
          method: 'POST',
          beforeRequest: onlyIncludeId,
          afterRequest: function (response) {},
          wrap: false,
        },
        inSmartBooks: {
          url: '{Id}/sendto/ASICS_Smartbooks/SendOrder',
          method: 'GET',
          interceptor: {},
          wrap: false,
        },
        $toProfitMaker: {
          url: '{Id}/sendto/ASICS_ProfitMaker',
          method: 'POST',
          beforeRequest: onlyIncludeId,
          afterRequest: function (response) {},
          wrap: false,
        },
        inProfitMaker: {
          url: '{Id}/sendto/ASICS_ProfitMaker/SendOrder',
          method: 'GET',
          interceptor: {},
          wrap: false,
        },
        $toExcit: {
          url: '{Id}/sendto/ASI_Excit',
          method: 'POST',
          beforeRequest: onlyIncludeId,
          afterRequest: function (response) {},
          wrap: false,
        },
        $validateExcit: {
          url: '{Id}/validateto/ASI_Excit',
          method: 'POST',
          beforeRequest: onlyIncludeId,
          afterRequest: function (response) {},
          wrap: false,
        },
        $updateOrderNumber: {
          url: '{Id}/number/{Number}',
          method: 'POST',
          interceptor: {},
          wrap: false,
          beforeRequest: function (response) {
            response.data = {};
          },
        },
        getByNumber: {
          url: 'number/{number}',
          method: 'GET',
        },
        validate: {
          url: '{Id}/validate',
          method: 'GET',
        },
        getLineItem: {
          url: '{Id}/lineitems/{Number}',
          method: 'GET',
        },
      },
      instance: {
        inHandsDay: inHandsDay,
        orderDay: orderDay,
        shipDay: shipDay,
        $importLineItems: function (lineItems) {
          return $http
            .post('/api/v1/orders/' + this.Id + '/lineitems/import', lineItems)
            .then(function (res) {
              var Model = model;
              return new Model(res.data);
            });
        },

        $fromOrder: function (options) {
          options = angular.extend({}, options);

          return $http
            .post('/api/v1/orders/' + this.Id + '/invoices', options)
            .then(function (res) {
              var Model = model;
              return new Model(res.data);
            });
        },

        $fromReOrder: function (options) {
          options = angular.extend({}, options);

          return $http
            .post(
              '/api/v1/orders/' + this.Id + '/reorder/' + this.Type,
              options
            )
            .then(function (res) {
              clearLocalOrderCache();

              var Model = model;

              return new Model(res.data);
            });
        },

        calculateTotals: function () {
          const newItems = updateLineItemTotals(this.LineItems, this);
          const totals = calculateOrderTotals(newItems, this);
          this.LineItems = newItems;
          this.Totals = totals;
        },

        clearLocalOrderCache: clearLocalOrderCache,

        getVendorLineItems: getVendorLineItems,
        setLineItemSequence: function (ids) {
          if (ids) {
            angular.forEach(this.LineItems, function (v) {
              if (v.Id) v.Sequence = ids.indexOf(v.Id);
              else v.Sequence = ids.indexOf(v.correlationId);
            });
            // the else case below reassigns sequence based on their order in the array, so re-sort the array by sequence
            this.LineItems = this.LineItems.sort(function (a, b) {
              return a.Sequence - b.Sequence;
            });
          } else {
            angular.forEach(this.LineItems, function (v, i) {
              v.Sequence = i;
            });
          }
        },
        clearInHandsDateOption: function () {
          this.IsInHandsDateFlexible = null;
        },
        addLineItem: function (options, splitShipment, lineItemSequence) {
          var item;

          if (
            options instanceof LineItem ||
            options instanceof ProductLineItem ||
            options instanceof ServiceCharge ||
            options instanceof TitleLineItem
          ) {
            item = options;
          } else {
            item = new LineItem(options);
          }

          if (splitShipment) {
            this.LineItems.splice(lineItemSequence, 0, item);
          } else {
            this.LineItems.push(item);
          }

          this.setLineItemSequence();

          updateVendorLineItems.apply(this);
        },
        removeLineItem: function (item) {
          if (
            item.ProductId &&
            angular.isDefined(_validatedLineItems[item.ProductId])
          ) {
            delete _validatedLineItems[item.ProductId];
          }

          removeItem(this.LineItems, item);

          this.setLineItemSequence();

          updateVendorLineItems.apply(this);
        },
        addNote: function (options) {
          var item;

          if (options instanceof OrderNote) {
            item = options;
          } else {
            item = new OrderNote(options);
          }

          this.Notes.push(item);
        },
        removeNote: function (item) {
          removeItem(this.Notes, item);
        },

        removeNotes: function (notes) {
          var _this = this;
          var ids = notes.map(function (note) {
            return note.Id;
          });

          var options = {
            data: ids,
            headers: { 'Content-Type': 'application/json' },
          };

          return $http
            .delete('/api/v1/orders/' + this.Id + '/notes', options)
            .then(function (data) {
              notes.forEach(function (note) {
                removeItem(_this.Notes, note);
              });

              return $q.resolve(data);
            })
            .catch(function (data) {
              return $q.reject(data);
            });
        },

        addPayment: function (options) {
          var item;

          options = options || {};

          if (angular.isUndefined(options.CurrencyCode)) {
            options.CurrencyCode = this.CurrencyCode;
          }

          if (options instanceof Payment) {
            item = options;
          } else {
            item = new Payment(options);
          }

          this.Payments.push(item);
        },
        removePayment: function (item) {
          removeItem(this.Payments, item);
        },

        addInstruction: function (options) {
          var item;

          if (options instanceof Instruction) {
            item = options;
          } else {
            item = new Instruction(options);
          }

          if (
            this.Type !== 'order' &&
            this.Type !== 'quote' &&
            item.Type === 'SpecialsPurchaseOrder'
          ) {
            return;
          }

          this.Instructions.push(item);
        },
        removeInstruction: function (item) {
          removeItem(this.Instructions, item);
        },

        attachFile: function (file) {
          var order = this;

          if (order.Id > 0 && file) {
            var req = {
              url:
                'api/v1/orders/' + order.Id + '/' + file.FileType.toLowerCase(),
              method: 'POST',
            };

            req.data = angular.copy(file);

            return $http(req);
          }
        },

        savePartialOrder: function (item, params) {
          var order = this;
          var def = $q.defer();

          updateProductsConfiguredStatus.apply(order);

          if (order.Id > 0) {
            var Model,
              req = {
                url: 'api/v1/orders/' + order.Id,
                method: 'POST',
                params: params,
              };

            // copy the data so we can manipulate
            // it before the request and not affect
            // the core object
            req.data = angular.copy(item);

            if (
              item instanceof LineItem ||
              item instanceof ProductLineItem ||
              item instanceof ServiceCharge ||
              item instanceof TitleLineItem
            ) {
              req.url += '/lineitems';
              Model = LineItem;
              if (item.calculateTotals) {
                item.calculateTotals(false, true);
              }

              if (item instanceof ServiceCharge && item.TaxRates) {
                if (item.TaxRates.length > 0) {
                  params.updateTaxes = 'none';
                }
              }
            } else if (item instanceof OrderNote) {
              req.url += '/notes';
              Model = OrderNote;
            } else if (item instanceof Payment) {
              req.url += '/payments';
              Model = Payment;
            }

            if (item.Id > 0) {
              req.method = 'PUT';
              req.url += '/' + item.Id;
            }

            if (angular.isDefined(Model)) {
              req.data = Model.$strip(req.data);
            }

            itemRequest(req, Model).then(function (res) {
              if (res) {
                // extend the value from the server to me
                shallowCopy(res, item);

                def.resolve(item);
              } else {
                def.resolve();
              }
            }, def.reject);
          } else {
            def.reject('Invalid request');
          }

          return def.promise;
        },

        deletePartialOrder: function (item) {
          var order = this;
          var def = $q.defer();

          if (order.Id > 0 && item.Id > 0) {
            var req = {
              url: 'api/v1/orders/' + order.Id,
              method: 'DELETE',
            };

            if (
              item instanceof LineItem ||
              item instanceof ProductLineItem ||
              item instanceof ServiceCharge ||
              item instanceof TitleLineItem
            ) {
              req.url += '/lineitems/' + item.Id;
            } else if (item instanceof OrderNote) {
              req.url += '/notes/' + item.Id;
            } else if (item instanceof Payment) {
              req.url += '/payments/' + item.Id;
            }

            itemRequest(req).then(def.resolve, def.reject);
          } else {
            def.reject('Invalid request');
          }

          return def.promise;
        },

        addMediaLink: function (mediaLink) {
          this.MediaLinks = angular.isArray(mediaLink)
            ? this.MediaLinks.concat(mediaLink)
            : this.MediaLinks.concat([mediaLink]);

          this.MediaLinks = this.MediaLinks.map(function (mediaLink) {
            mediaLink =
              mediaLink instanceof MediaLink
                ? mediaLink
                : new MediaLink(mediaLink);
            return mediaLink;
          });
          removeDuplicateArt(this);
          setArtwork.apply(this);
        },
        removeMediaLink: function (mediaLink) {
          var mediaId = mediaLink.MediaId;

          if (this.LineItems && this.LineItems.length) {
            angular.forEach(this.LineItems, function (item) {
              if (angular.isDefined(item.Decorations)) {
                item = item.Decorations.map(function (decoration) {
                  if (
                    decoration.Artwork &&
                    decoration.Artwork.length &&
                    decoration.Artwork[0].MediaId === mediaId
                  ) {
                    decoration.Artwork = [];
                  }
                  return decoration;
                });
              }
            });
          }

          removeArtwork.call(this, mediaId);
        },
        validateSalesperson: validateSalesperson,
        setIsTaxable: setIsTaxable,
        serverValidate: serverValidate,
      },
      serverValidateOrder: serverValidateOrder,
      getDocumentUrl: getDocumentUrl,
      setVendorValidity: setVendorValidity,
      preSave: preSave,
      query: singleRequestService.getMethod('/api/v1/orders'),
      queryAllowDuplicates: function (params) {
        return $http({
          url: '/api/v1/orders',
          method: 'GET',
          params: params,
        }).then(function (res) {
          return res.data;
        });
      },
      quoteFrom: function (order, options) {
        return $http
          .post('/api/v1/orders/' + order.Id + '/quotes', options)
          .then(function (res) {
            clearLocalOrderCache();
            var Model = model;

            return new Model(res.data);
          });
      },
      salesOrders: function (order, options) {
        options = angular.extend({}, options);

        return $http
          .post('/api/v1/orders/' + order.Id + '/salesorders', options)
          .then(function (res) {
            var Model = model;

            return new Model(res.data);
          });
      },
    });

    return model;

    function init(instance) {
      OrderStatus.setSecurityPolicy(instance);

      updateVendorLineItems.apply(instance);

      instance.TypeName = getOrderDocumentTypeName(instance.Type);

      removeDuplicateArt(instance);
      setArtwork.apply(instance);

      angular.forEach(instance.References, function (ref) {
        ref.TypeName = getOrderDocumentTypeName(ref.Type);
      });

      instance.Notes.groupNotes();

      instance.calculateTotals();

      if (!instance.Id) {
        instance.Date = mapDate(shortDate(moment()));
      }

      // Fix any bad data.
      instance.Date = instance.Date ? instance.Date.startOf('day') : null;
      instance.InHandsDate = instance.InHandsDate
        ? instance.InHandsDate.startOf('day')
        : null;
      instance.ShipDate = instance.ShipDate
        ? instance.ShipDate.startOf('day')
        : null;

      var creditTerm = _.find(LookupTypes.CreditTerms, {
        Name: instance.CreditTerm,
      });
      instance.CreditTerm = creditTerm ? creditTerm.Code : null;

      var paymentMethod = _.find(LookupTypes.PaymentMethods, {
        Name: instance.PaymentMethod,
      });
      instance.PaymentMethod = paymentMethod ? paymentMethod.Code : null;

      setCalendarFields.apply(instance);

      instance.Currencies = instance.Currencies.defaults(instance);

      if (instance.Id) {
        if (instance.Type === 'order') {
          instance.hasInvoice = _.some(instance.References, {
            Type: 'invoice',
          });
        }

        setStatusKind.apply(instance);
      }

      function setStatusKind() {
        var kind = OrderStatus.getStatusKind(this.Status);

        this.OldStatusKind = kind;
        this.StatusKind = kind;
      }
    }

    function clearLocalOrderCache() {
      _orderCompanies = [];
      _validOrderCompanies = [];
      _validatedLineItems = {};
    }

    function datepickerDay(key, newVal) {
      if (typeof newVal !== 'undefined') {
        this[key] = mapDate(shortDate(newVal));

        return validate.apply(this);
      }

      return this._datepicker[key];
    }

    function itemRequest(req, Factory) {
      var def = $q.defer();

      $http(req).then(function (res) {
        if (angular.isDefined(Factory) && typeof Factory === 'function') {
          def.resolve(new Factory(res.data));
        } else {
          def.resolve(res.data);
        }
      }, def.reject);

      return def.promise;
    }

    function removeItem(arr, item) {
      if (angular.isDefined(item)) {
        if (typeof item === 'number') {
          if (angular.isDefined(arr[item])) {
            arr.splice(item, 1);
          }
        } else {
          arr.splice(arr.indexOf(item), 1);
        }
      }
    }

    function preSave(instance) {
      var i;

      updateProductsConfiguredStatus.apply(instance);

      if (instance.data.Type === 'invoice') {
        delete instance.data.AcknowledgementContact;
      }

      // Remove any undefined instructions.
      if (angular.isDefined(instance.data.Instructions)) {
        for (i = instance.data.Instructions.length - 1; i >= 0; i--) {
          if (instance.data.Instructions[i].isUndefined()) {
            instance.data.Instructions.splice(i, 1);
          }
        }
      }

      // Remove any undefined lineitem decoration details.
      if (instance.data.LineItems && instance.data.LineItems.length) {
        _.forEach(instance.data.LineItems, function (lineItem) {
          if (lineItem.Decorations && lineItem.Decorations.length) {
            _.forEach(lineItem.Decorations, function (decoration) {
              decoration.preSave();
            });
          }
        });
      }

      // Remove any undefined notes.
      if (angular.isDefined(instance.data.Notes)) {
        for (i = instance.data.Notes.length - 1; i >= 0; i--) {
          if (instance.data.Notes[i].isUndefined()) {
            instance.data.Notes.splice(i, 1);
          }
        }
      }

      // Billing Contact
      // {
      if (
        angular.isDefined(instance.data.BillingContact) &&
        instance.data.BillingContact !== null
      ) {
        if (
          angular.isDefined(instance.data.BillingContact.Address) &&
          instance.data.BillingContact.Address !== null &&
          instance.data.BillingContact.Address.isUndefined()
        ) {
          delete instance.data.BillingContact.Address;
        }
      }
      // }

      // Shipping Contact
      // {
      if (angular.isDefined(instance.data.ShippingContact)) {
        if (
          angular.isDefined(instance.data.ShippingContact.Address) &&
          instance.data.ShippingContact.Address !== null &&
          instance.data.ShippingContact.Address.isUndefined()
        ) {
          delete instance.data.ShippingContact.Address;
        }
      }
      // }

      // Acknowledgement Contact
      // {
      if (
        angular.isDefined(instance.data.AcknowledgementContact) &&
        instance.data.AcknowledgementContact !== null
      ) {
        if (
          angular.isDefined(instance.data.AcknowledgementContact.Address) &&
          instance.data.AcknowledgementContact.Address !== null &&
          instance.data.AcknowledgementContact.Address.isUndefined()
        ) {
          delete instance.data.AcknowledgementContact.Address;
        }
      }
      // }

      // Currency
      // {
      if (instance.data.Currencies.length) {
        instance.data.Currencies = instance.data.Currencies.filter(function (
          cur
        ) {
          return cur.ConversionRate > 0;
        });
      }
      // }

      instance.data.CreditTerm =
        angular.isDefined(instance.data.CreditTerm) &&
        instance.data.CreditTerm !== null
          ? instance.data.CreditTerm
          : null;
      instance.data.PaymentMethod =
        angular.isDefined(instance.data.PaymentMethod) &&
        instance.data.PaymentMethod !== null
          ? instance.data.PaymentMethod
          : null;
    }

    function onlyIncludeId(instance) {
      instance.data = {
        Id: instance.data.Id,
      };
    }

    function includeIdAndType(instance) {
      instance.data = {
        Id: instance.data.Id,
        Type: instance.data.Type,
      };
    }

    function setArtwork() {
      if (this.MediaLinks && this.MediaLinks.length > 0) {
        this.Artwork = this.MediaLinks.filter(function (media) {
          return media.FileType === 'Artwork';
        });
      }
    }

    function removeArtwork(mediaId) {
      this.Artwork = this.Artwork.filter(function (media) {
        return media.MediaId !== mediaId;
      });

      this.MediaLinks = this.MediaLinks.filter(function (media) {
        return media.MediaId !== mediaId;
      });
    }

    function inHandsDay(newVal) {
      return datepickerDay.apply(this, ['InHandsDate', newVal]);
    }

    function mapDate(val) {
      if (val) {
        if (val instanceof moment) {
          return val.clone();
        }

        return moment.utc(val);
      }

      return null;
    }

    function orderDay(newVal) {
      return datepickerDay.apply(this, ['Date', newVal]);
    }

    function setCalendarFields() {
      var dateFields = ['Date', 'InHandsDate', 'ShipDate'];

      this._datepicker = dateFields.reduce(setDate.bind(this), {});

      function setDate(obj, dateField) {
        obj[dateField] = this[dateField]
          ? moment(shortDate(this[dateField])).toDate()
          : null;

        return obj;
      }
    }

    function shipDay(newVal) {
      return datepickerDay.apply(this, ['ShipDate', newVal]);
    }

    function shortDate(val) {
      if (val) {
        if (val instanceof moment) {
          return val.format('YYYY-MM-DD');
        }

        return (
          val.getFullYear() +
          '-' +
          ('0' + (val.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + val.getDate()).slice(-2)
        );
      }

      return null;
    }

    function validate() {
      setCalendarFields.apply(this);
    }

    function validateSalesperson() {
      var validSalesperson = true;
      if (
        (typeof this.Salespersons === 'undefined' ||
          !this.Salespersons.length) &&
        this.Type !== 'quote'
      ) {
        var message = this.Type === 'order' ? 'Sales Order' : this.TypeName;
        confirmDialog.open({
          message: 'Please include a sales person on your ' + message + '.',
          hideCancel: true,
        });
        validSalesperson = false;
      }
      return validSalesperson;
    }

    function getVendorLineItems() {
      var def = $q.defer(),
        order = this,
        result = {}; // Keys are strings to keep sequence.

      updateProductsConfiguredStatus.apply(this);

      var promises = order.LineItems.reduce(lineItemVendorGroupReducer, []);

      $q.all(promises).finally(function () {
        def.resolve(result);
      });

      return def.promise;

      function lineItemVendorGroupReducer(promises, lineItem) {
        if (angular.isDefined(lineItem.Supplier) && lineItem.Supplier.Id) {
          var k1 = 's' + lineItem.Supplier.Id;

          if (angular.isUndefined(result[k1])) {
            result[k1] = angular.extend(
              { Products: [], IsValid: false },
              lineItem.Supplier
            );

            if (
              !lineItem.Supplier.HasExternalEmails &&
              lineItem.Supplier.ExternalId
            ) {
              promises.push(
                getPersonifyEmails.apply(order, [lineItem.Supplier])
              );
            }

            if (order.Type === 'order') {
              promises.push(
                validateExcitSendCapability.apply(order, [result[k1]])
              );
            }
          }

          angular.forEach(lineItem.Decorations, function (decoration) {
            if (
              angular.isDefined(decoration.Decorator) &&
              decoration.Decorator.Id &&
              lineItem.Supplier.Id !== decoration.Decorator.Id
            ) {
              var k2 = 'd' + decoration.Decorator.Id;

              if (angular.isUndefined(result[k2])) {
                result[k2] = angular.extend(
                  { Products: [], IsValid: false },
                  decoration.Decorator
                );
                // if (order.Type === 'order') {
                //  validateExcitSendCapability.apply(order, [result[k2]]); // Decorators don't have excit integration
                // }
              }

              result[k2].Products.push(decoration);
            }
          });

          result[k1].Products.push(lineItem);
        }

        return promises;
      }

      function getPersonifyEmails(party) {
        return Company.personifyEmails({ Id: party.ExternalId }).then(function (
          res
        ) {
          party.setPersonifyEmails(res);
        });
      }

      function validateExcitSendCapability(party) {
        var order = this;

        var def = $q.defer();

        excitOrderCapabilityCheck().then(lineItemValidationCheck);

        return def.promise;

        function lineItemValidationCheck() {
          if (!_validOrderCompanies[party.Id]) {
            setVendorValidity(party, false);
            return def.resolve();
          }

          var promises = party.Products.reduce(
            excitLineItemValidationReducer,
            []
          );

          $q.all(promises)
            .then(function (res) {
              setVendorValidity(party, res.indexOf(false) < 0);
            })
            .catch(function () {
              setVendorValidity(party, false);
            })
            .finally(def.resolve);

          function excitLineItemValidationReducer(promises, lineItem) {
            if (lineItem && lineItem.ProductId) {
              if (lineItem.ProductId in _validatedLineItems) {
                promises.push(
                  $q.resolve(_validatedLineItems[lineItem.ProductId])
                );
              } else {
                promises.push(
                  Product.get({ Id: lineItem.ProductId }).then(function (res) {
                    var hasExcit = false;

                    if (res) {
                      hasExcit =
                        angular.isDefined(res.Services) &&
                        res.Services.some(function (s) {
                          return s.Code === 'OAPI';
                        });
                      _validatedLineItems[lineItem.ProductId] = hasExcit;
                    }

                    return hasExcit;
                  })
                );
              }
            } else {
              promises.push($q.resolve(false));
            }

            return promises;
          }
        }

        function excitOrderCapabilityCheck() {
          if ({}.hasOwnProperty.call(_orderCompanies, party.Id)) {
            party.CanSendOrder = _orderCompanies[party.Id];
            return (
              excitOrderValidationCheck.apply(order, [party]) || $q.resolve()
            );
          } else if (!party.IsAsiMember) {
            party.CanSendOrder = false;
            return $q.resolve((_orderCompanies[party.Id] = false));
          } else {
            return $http
              .get('/api/v1/settings/capabilities/ASI_Excit/OAPI/' + party.Id)
              .then(function (res) {
                party.CanSendOrder = res && res.data === true;
                _orderCompanies[party.Id] = res && res.data === true;
                return excitOrderValidationCheck.apply(order, [party]);
              });
          }

          function excitOrderValidationCheck(party) {
            // Method to set validity on supplier excit button.  Currently it only checks if it's been sent, but other validation rules about the order can be added here.  Example: Shipping information exist, there is in-hands date, etc.
            if (party.CanSendOrder) {
              if ({}.hasOwnProperty.call(_validOrderCompanies, party.Id)) {
                return $q.resolve(
                  (party.IsValid = _validOrderCompanies[party.Id])
                );
              } else if (!party.IsAsiMember || !this.Id) {
                return $q.resolve(setVendorValidity(party, false));
              } else {
                return $http
                  .get(
                    '/api/v1/orders/' +
                      this.Id +
                      '/sendto/ASI_Excit/?supplierId=' +
                      party.Id
                  )
                  .then(function (res) {
                    setVendorValidity(party, res && res.data === false);
                  });
              }
            }
          }
        }
      }
    }

    function buildUrl(url, parameters) {
      var qs = '';

      if (parameters) {
        qs += _.reduce(
          parameters,
          function (result, p, k) {
            result += encodeURIComponent(k) + '=' + encodeURIComponent(p) + '&';

            return result;
          },
          ''
        );
      }

      if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); // chop off last "&"
        url = url + '?' + qs;
      }

      return url;
    }

    function getDocumentUrl(
      order,
      outputType,
      docType,
      vendor,
      dl,
      poId,
      version
    ) {
      if (order.Id > 0) {
        var base = '/orders/';
        if (version > 0) {
          base = '/docs/';
        }

        var params = {};
        if (angular.isDefined(docType)) {
          params.documentType = docType;
        }
        if (angular.isDefined(vendor) && angular.isDefined(vendor.Id)) {
          params.supplierId = vendor.Id;
        }
        if (outputType === 'pdf' && dl) {
          params.dl = true;
        }

        if (angular.isDefined(poId)) {
          params.po = poId;
        }
        var url = base + order.Id + '/' + outputType;
        url = buildUrl(url, params);
        return url;
      }
    }

    function setVendorValidity(vendor, valid) {
      vendor.IsValid = valid;
      _validOrderCompanies[vendor.Id] = valid;
    }

    function setIsTaxable(isTaxable) {
      this.LineItems.forEach(function (item) {
        item.setIsTaxable && item.setIsTaxable(isTaxable);
      });
    }

    function updateProductsConfiguredStatus() {
      if (this.LineItems && this.LineItems.allProductsConfigured) {
        this.AllProductsConfigured = this.LineItems.allProductsConfigured();
      }
    }

    function updateVendorLineItems() {
      var instance = this;

      clearLocalOrderCache();

      this.getVendorLineItems().then(function (res) {
        instance.VendorLineItems = res;
      });
    }

    function serverValidate() {
      var order = this;

      return serverValidateOrder(order.Id);
    }

    function serverValidateOrder(id, onError) {
      var req = {
        url: 'api/v1/orders/' + id + '/validate',
        method: 'GET',
      };

      var def = $q.defer();

      $http(req)
        .then(function (res) {
          def.resolve();
        })
        .catch(function (res) {
          if (onError && typeof onError === 'function') {
            onError(res);
          } else {
            var errorMsg = 'Order Validation failed.';
            if (typeof res.data === 'string') {
              errorMsg = res.data.replace('ERROR:', '');
            } else {
              try {
                var messages = res.data.reduce(reduceExceptions, []);

                errorMsg =
                  '<ul class="error-list">' + messages.join('') + '</ul>';
              } catch (e) {
                // empty catches are disallowed by ESLint >:| - DJL 11/9/2017
              }
            }

            growlFactory.error(errorMsg, { closeButton: true, timeOut: 0 });
          }
        }, def.reject);

      return def.promise;

      function reduceExceptions(acc, msg) {
        var li = '<li>' + msg.Message + '</li>';

        if (acc.indexOf(li) === -1) {
          acc.push(li);
        }

        return acc;
      }
    }

    function removeDuplicateArt(instance) {
      if (instance.MediaLinks && instance.MediaLinks.length > 0) {
        var mediaIds = [];

        instance.MediaLinks = instance.MediaLinks.filter(function (link) {
          if (mediaIds.indexOf(link.MediaId) < 0) {
            mediaIds.push(link.MediaId);
            return true;
          }

          return false;
        });
      }
    }
  }
})();
*/

export function calculateOrderTotals(
  newItems: OrderLineItemDomainModel[],
  order: Readonly<Order>
) {
  const productLineItems = newItems.filter(isProductLineItem);
  const serviceLineItems = newItems.filter(isServiceLineItem);
  const totalledLineItems = [...productLineItems, ...serviceLineItems];

  const productAmount = productLineItems.reduce((sum, item) => {
    const convertedTotals = item.ConversionTotals;
    return roundToPlace(sum + convertedTotals.Amount, 4);
  }, 0);

  const result = {
    Amount: 0,
    DiscountAmount: 0,
    Cost: 0,
    Margin: 0,
    MarginPercent: 0,
    SalesTax: 0,
    TotalAmount: 0,
    AmountDue: 0,
    AmountPaid: getAmountPaid(order),
    ProductAmount: productAmount,
  };

  totalledLineItems.forEach((item) => {
    const convertedTotals = item.ConversionTotals;
    result.Amount = roundToPlace(result.Amount + convertedTotals.Amount, 4);
    result.Cost = roundToPlace(result.Cost + convertedTotals.Cost, 4);
    result.Margin = roundToPlace(result.Margin + convertedTotals.Margin, 4);
    result.SalesTax = roundToPlace(
      result.SalesTax + convertedTotals.SalesTax,
      4
    );
  });

  result.Amount = roundToPlace(result.Amount, 2);
  result.SalesTax = roundToPlace(result.SalesTax, 2);

  if (order.Discount) {
    result.DiscountAmount = roundToPlace(
      (order.Discount / 100) * result.Amount,
      2
    );
  }

  result.Margin = roundToPlace(result.Margin - result.DiscountAmount, 2);
  result.MarginPercent =
    roundToPlace(
      (result.Margin / (result.Amount - result.DiscountAmount) || 1) * 100,
      2
    ) || 0;
  result.TotalAmount = roundToPlace(
    result.Amount - result.DiscountAmount + result.SalesTax,
    2
  );
  result.AmountDue = roundToPlace(result.TotalAmount - result.AmountPaid, 2);
  return result;
}

function getAmountPaid(order: Readonly<Order>) {
  var result = 0,
    currency = [];

  (order.Payments || []).forEach(function (item) {
    if (order.CurrencyCode !== item.CurrencyCode) {
      if (order.Currencies && order.Currencies.length) {
        currency = order.Currencies.filter(function (cur) {
          return cur.ConversionRate && cur.CurrencyCode === item.CurrencyCode;
        });

        if (currency.length) {
          result += currency[0].ConversionRate * item.Amount;
        }
      }
    } else {
      result += item.Amount;
    }
  });

  return roundToPlace(result, 2);
}

export function updateLineItemTotals(
  lineItems: OrderLineItemDomainModel[],
  order: Order
) {
  // ✔ All of the following have been integrated into the line item totals calculations
  // Note that the original method would have taken in the non-viewmodels, but I
  //  just needed to get this to compile because this logic is actually done elsewhere
  return lineItems.map(function (item) {
    if (isProductLineItem(item)) {
      const newItem: ProductLineItemDomainModel = { ...item };
      const taxRate = calculateTaxRate(item.TaxRates);
      newItem.Totals = calculateProductLineItemTotals(item, taxRate, false);
      newItem.ConversionTotals = calculateConvertedProductLineItemTotals(
        newItem,
        taxRate,
        order.Currencies,
        order.CurrencyCode,
        order.Discount
      );
      return newItem;
    } else if (isServiceLineItem(item)) {
      const newItem: ServiceLineItemDomainModel = { ...item };
      const taxRate = calculateTaxRate(item.TaxRates);
      newItem.Totals = calculateTotalsWithTaxRate(item, taxRate);
      newItem.ConversionTotals = calculateConvertedServiceChargeTotals(
        newItem,
        order.Currencies,
        item.TaxRates,
        order.CurrencyCode,
        order.Discount
      );
      return newItem;
    }
    return item;
  });
}

export function getOrderDocumentTypeName(orderType: OrderType) {
  if (orderType === 'samplerequest') return 'Sample Request';
  else if (orderType === 'quote') return 'Quote';
  else if (orderType === 'order') return 'Order';
  else if (orderType === 'invoice') return 'Invoice';
  return orderType;
}
