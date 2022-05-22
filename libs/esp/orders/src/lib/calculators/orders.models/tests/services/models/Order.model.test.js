(function () {
  'use strict';

  describe('Order Model', function () {
    var mockDate,
      mockOrder,
      $httpBackend,
      LookupTypes,
      LineItem,
      ProductLineItem,
      ServiceCharge,
      TitleLineItem,
      OrderNote,
      Instruction,
      MediaLink,
      Payment,
      Order;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (
      _$httpBackend_,
      _Order_,
      _LookupTypes_,
      _LineItem_,
      _ProductLineItem_,
      _ServiceCharge_,
      _TitleLineItem_,
      _OrderNote_,
      _Instruction_,
      _MediaLink_,
      _Payment_
    ) {
      $httpBackend = _$httpBackend_;
      Order = _Order_;
      LookupTypes = _LookupTypes_;
      LineItem = _LineItem_;
      ProductLineItem = _ProductLineItem_;
      ServiceCharge = _ServiceCharge_;
      TitleLineItem = _TitleLineItem_;
      OrderNote = _OrderNote_;
      Instruction = _Instruction_;
      MediaLink = _MediaLink_;
      Payment = _Payment_;

      mockDate = new Date('2016-02-21T00:00:00Z');

      mockOrder = new Order();
    }));

    it('defaults', function () {
      expect(mockOrder.Type).toEqual('order');
      expect(mockOrder.Status).toEqual('Open');
      expect(mockOrder.Date).not.toEqual(null);
      expect(mockOrder.InHandsDate).toEqual(null);
      expect(mockOrder.ShipDate).toEqual(null);
      expect(mockOrder.LineItems.length).toEqual(0);
      expect(mockOrder.Notes.length).toEqual(0);
      expect(mockOrder.Instructions.length).toEqual(0);
      expect(mockOrder.Tags.length).toEqual(0);
      expect(angular.isDefined(mockOrder.Aggregations)).toBeTruthy();
      expect(mockOrder.Payments.length).toEqual(0);
      expect(mockOrder.IsEditable).toBeTruthy();
      expect(mockOrder.Discount).toEqual(0);
      expect(angular.isDefined(mockOrder.Totals)).toBeTruthy();
      expect(mockOrder.Artwork.length).toEqual(0);
      expect(mockOrder.IsBlindShip).toBeFalsy();
      expect(mockOrder.AllProductsConfigured).toBeTruthy();
    });

    it('init', function () {
      mockOrder = new Order({
        Type: 'samplerequest',
        MediaLinks: [
          { FileType: 'Test', FileUrl: 'http://google.com', MediaId: 1 },
          { FileType: 'Artwork', FileUrl: 'http://facebook.com', MediaId: 2 },
        ],
        Notes: [{ Content: 'Test Content' }],
        Date: new Date(),
        InHandsDate: new Date(),
        ShipDate: new Date(),
        CreditTerm: { Code: 'Test Code', Name: 'Test Name' },
        PaymentMethod: { Code: 'Test Code', Name: 'Test Name' },
      });

      expect(mockOrder.MediaLinks.length).toEqual(2);
      expect(mockOrder.Artwork.length).toEqual(1);
      expect(mockOrder.Artwork[0].FileType).toEqual('Artwork');
      expect(mockOrder.Artwork[0].FileUrl).toEqual('http://facebook.com');

      expect(angular.isDefined(mockOrder.Notes.groups)).toBeTruthy();

      expect(mockOrder.Date).not.toEqual(null);
      expect(mockOrder.InHandsDate).not.toEqual(null);
      expect(mockOrder.ShipDate).not.toEqual(null);

      expect(mockOrder.CreditTerm).toEqual(null);

      expect(mockOrder.PaymentMethod).toEqual(null);

      expect(mockOrder._datepicker.Date).not.toEqual(null);
      expect(mockOrder._datepicker.InHandsDate).not.toEqual(null);
      expect(mockOrder._datepicker.ShipDate).not.toEqual(null);

      expect(mockOrder.Currencies.length > 0).toBeTruthy();
    });

    it('inHandsDay', function () {
      mockOrder = new Order({
        InHandsDate: mockDate,
      });

      var newDate = new Date('2015-04-02');

      mockOrder.inHandsDay(newDate);

      expect(mockOrder.InHandsDate.valueOf()).toEqual(
        mapDate(shortDate(newDate)).valueOf()
      );
      expect(mockOrder._datepicker.InHandsDate).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
      expect(mockOrder.inHandsDay()).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
    });

    it('orderDay', function () {
      mockOrder = new Order({
        Date: mockDate,
      });

      var newDate = new Date('2015-04-02');

      mockOrder.orderDay(newDate);

      expect(mockOrder.Date.valueOf()).toEqual(
        mapDate(shortDate(newDate)).valueOf()
      );
      expect(mockOrder._datepicker.Date).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
      expect(mockOrder.orderDay()).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
    });

    it('shipDay', function () {
      mockOrder = new Order({
        ShipDate: mockDate,
      });

      var newDate = new Date('2015-04-02');

      mockOrder.shipDay(newDate);

      expect(mockOrder.ShipDate.valueOf()).toEqual(
        mapDate(shortDate(newDate)).valueOf()
      );
      expect(mockOrder._datepicker.ShipDate).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
      expect(mockOrder.shipDay()).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
    });

    it('calculateTotals', function () {
      mockOrder = new Order({
        Discount: 5,
        Payments: [
          {
            CurrencyCode: 'CAD',
            Amount: 5,
          },
        ],
      });
      mockOrder.addLineItem(
        new ProductLineItem({
          TaxRates: [
            {
              Rate: 5,
            },
          ],
          Decorations: [
            {
              ServiceCharges: [
                {
                  ServiceType: 'Setup Charge',
                  Quantity: 10,
                  Price: 20,
                  Cost: 30,
                  IsVisible: true,
                  CurrencyCode: 'CAD',
                },
              ],
            },
          ],
        })
      );
      mockOrder.calculateTotals();
      expect(mockOrder.Totals.Amount).toEqual(200);
      expect(mockOrder.Totals.DiscountAmount).toEqual(10);
      expect(mockOrder.Totals.Cost).toEqual(300);
      expect(mockOrder.Totals.Margin).toEqual(-110);
      expect(mockOrder.Totals.SalesTax).toEqual(9.5);
      expect(mockOrder.Totals.TotalAmount).toEqual(199.5);
      expect(mockOrder.Totals.AmountDue).toEqual(199.5);
      expect(mockOrder.Totals.AmountPaid).toEqual(0);
      expect(mockOrder.Totals.ProductAmount).toEqual(NaN);
      expect(mockOrder.Totals.DiscountAmount).toEqual(10);

      mockOrder.Discount = 0;
      mockOrder.addLineItem(
        new ProductLineItem({
          TaxRates: [
            {
              Rate: 5,
            },
          ],
          ServiceCharges: [
            {
              IsRunCharge: true,
              Description: 'Test Description',
              Quantity: 10,
              Price: 20,
              Cost: 30,
              Margin: 40,
            },
          ],
        })
      );
      mockOrder.calculateTotals();
      expect(mockOrder.Totals.Amount).toEqual(220);
      expect(mockOrder.Totals.DiscountAmount).toEqual(0);
      expect(mockOrder.Totals.Cost).toEqual(330);
      expect(mockOrder.Totals.Margin).toEqual(-110);
      expect(mockOrder.Totals.SalesTax).toEqual(11);
      expect(mockOrder.Totals.TotalAmount).toEqual(231);
      expect(mockOrder.Totals.AmountDue).toEqual(231);
      expect(mockOrder.Totals.AmountPaid).toEqual(0);
      expect(mockOrder.Totals.ProductAmount).toEqual(NaN);
      expect(mockOrder.Totals.DiscountAmount).toEqual(0);

      mockOrder.Discount = 0;
      mockOrder.Currencies = [{ CurrencyCode: 'CAD', ConversionRate: '2' }];
      mockOrder.addLineItem(
        new ProductLineItem({
          TaxRates: [
            {
              Rate: 5,
            },
          ],
          ServiceCharges: [
            {
              IsRunCharge: true,
              Description: 'Test Description',
              Quantity: 10,
              Price: 20,
              Cost: 30,
              Margin: 40,
            },
          ],
        })
      );
      mockOrder.calculateTotals();
      expect(mockOrder.Totals.Amount).toEqual(440);
      expect(mockOrder.Totals.DiscountAmount).toEqual(0);
      expect(mockOrder.Totals.Cost).toEqual(660);
      expect(mockOrder.Totals.Margin).toEqual(-220);
      expect(mockOrder.Totals.SalesTax).toEqual(22);
      expect(mockOrder.Totals.TotalAmount).toEqual(462);
      expect(mockOrder.Totals.AmountDue).toEqual(452);
      expect(mockOrder.Totals.AmountPaid).toEqual(10);
      expect(mockOrder.Totals.ProductAmount).toEqual(NaN);
      expect(mockOrder.Totals.DiscountAmount).toEqual(0);

      mockOrder.Discount = 7;
      mockOrder.CurrencyCode = 'CAD';
      mockOrder.addLineItem(
        new ProductLineItem({
          TaxRates: [
            {
              Rate: 7,
            },
          ],
          ServiceCharges: [
            {
              IsRunCharge: true,
              Description: 'Test Description',
              Quantity: 10,
              Price: 20,
              Cost: 30,
              Margin: 40,
            },
          ],
        })
      );

      mockOrder.calculateTotals();
      expect(mockOrder.Totals.Amount).toEqual(260);
      expect(mockOrder.Totals.DiscountAmount).toEqual(18.2);
      expect(mockOrder.Totals.Cost).toEqual(390);
      expect(mockOrder.Totals.Margin).toEqual(-148.2);
      expect(mockOrder.Totals.SalesTax).toEqual(12.46);
      expect(mockOrder.Totals.TotalAmount).toEqual(254.26);
      expect(mockOrder.Totals.AmountDue).toEqual(249.26);
      expect(mockOrder.Totals.AmountPaid).toEqual(5);
      expect(mockOrder.Totals.ProductAmount).toEqual(NaN);
      expect(mockOrder.Totals.DiscountAmount).toEqual(18.2);
    });

    it('getVendorLineItems', function () {
      mockOrder = new Order();

      mockOrder.addLineItem(
        new ProductLineItem({
          Supplier: { Id: 1, HasExternalEmails: false, ExternalId: 2 },
          Decorations: [{ Decorator: { Id: 3 } }],
        })
      );
      mockOrder.getVendorLineItems().then(function (res) {
        expect(angular.isDefined(res)).toBeTruthy();
      });

      mockOrder.LineItems[0].Supplier.HasExternalEmails = true;
      mockOrder.getVendorLineItems().then(function (res) {
        expect(angular.isDefined(res)).toBeTruthy();
      });
    });

    it('setLineItemSequence', function () {
      mockOrder = new Order({
        LineItems: [
          new LineItem({ Type: 'product' }),
          new LineItem({ Type: 'service' }),
          new LineItem({ Type: 'title' }),
        ],
      });
      mockOrder.setLineItemSequence();

      expect(mockOrder.LineItems[0].Sequence).toEqual(0);
      expect(mockOrder.LineItems[1].Sequence).toEqual(1);
      expect(mockOrder.LineItems[2].Sequence).toEqual(2);
    });

    it('addLineItem', function () {
      mockOrder.addLineItem({ Type: 'title' });
      mockOrder.addLineItem(new ProductLineItem());
      mockOrder.addLineItem(new ServiceCharge());
      mockOrder.addLineItem(new TitleLineItem());

      expect(mockOrder.LineItems.length).toEqual(4);
      expect(mockOrder.LineItems[0].Sequence).toEqual(0);
      expect(mockOrder.LineItems[1].Sequence).toEqual(1);
      expect(mockOrder.LineItems[2].Sequence).toEqual(2);
      expect(mockOrder.LineItems[3].Sequence).toEqual(3);
    });

    it('removeLineItem', function () {
      mockOrder.addLineItem({ ProductId: 1, Type: 'title' });
      mockOrder.addLineItem(new ProductLineItem());
      mockOrder.addLineItem(new ServiceCharge());
      mockOrder.addLineItem(new TitleLineItem());

      expect(mockOrder.LineItems.length).toEqual(4);
      expect(mockOrder.LineItems[0].Sequence).toEqual(0);
      expect(mockOrder.LineItems[1].Sequence).toEqual(1);
      expect(mockOrder.LineItems[2].Sequence).toEqual(2);
      expect(mockOrder.LineItems[3].Sequence).toEqual(3);

      mockOrder.removeLineItem({ ProductId: 1, Type: 'title' });
      expect(mockOrder.LineItems.length).toEqual(3);
      expect(mockOrder.LineItems[0].Sequence).toEqual(0);
      expect(mockOrder.LineItems[1].Sequence).toEqual(1);
      expect(mockOrder.LineItems[2].Sequence).toEqual(2);
    });

    it('addNote', function () {
      mockOrder.addNote(new OrderNote({ Content: 'Test Content1' }));
      mockOrder.addNote({ Content: 'Test Content2' });

      expect(mockOrder.Notes.length).toEqual(2);
      expect(mockOrder.Notes[0].Content).toEqual('Test Content1');
      expect(mockOrder.Notes[1].Content).toEqual('Test Content2');
    });

    it('removeNote', function () {
      mockOrder.addNote({ Content: 'Test Content' });

      expect(mockOrder.Notes.length).toEqual(1);
      expect(mockOrder.Notes[0].Content).toEqual('Test Content');

      mockOrder.removeNote({ Content: 'Test Content' });
      expect(mockOrder.Notes.length).toEqual(0);
    });

    it('addPayment', function () {
      mockOrder.CurrencyCode = 'USA';
      mockOrder.addPayment(new Payment({ CurrencyCode: 'CAD' }));
      mockOrder.addPayment({ Date: new Date(), CurrencyCode: undefined });

      expect(mockOrder.Payments.length).toEqual(2);
      expect(mockOrder.Payments[0].CurrencyCode).toEqual('CAD');
      expect(mockOrder.Payments[1].CurrencyCode).toEqual('USA');
    });

    it('removePayment', function () {
      var payment = new Payment({ CurrencyCode: 'CAD' });

      expect(mockOrder.Payments.length).toEqual(0);

      mockOrder.addPayment(payment);
      expect(mockOrder.Payments.length).toEqual(1);
      expect(mockOrder.Payments[0].CurrencyCode).toEqual('CAD');

      mockOrder.removePayment(payment);
      expect(mockOrder.Payments.length).toEqual(0);
    });

    it('addInstruction', function () {
      mockOrder.addInstruction(
        new Instruction({ Type: 'Test Type1', Content: 'Test Content1' })
      );
      mockOrder.addInstruction({
        Type: 'Test Type2',
        Content: 'Test Content2',
      });

      expect(mockOrder.Instructions.length).toEqual(2);
      expect(mockOrder.Instructions[0].Type).toEqual('Test Type1');
      expect(mockOrder.Instructions[0].Content).toEqual('Test Content1');
      expect(mockOrder.Instructions[1].Type).toEqual('Test Type2');
      expect(mockOrder.Instructions[1].Content).toEqual('Test Content2');
    });

    it('removeInstruction', function () {
      mockOrder.addInstruction({ Type: 'Test Type', Content: 'Test Content' });
      expect(mockOrder.Instructions.length).toEqual(1);
      expect(mockOrder.Instructions[0].Type).toEqual('Test Type');
      expect(mockOrder.Instructions[0].Content).toEqual('Test Content');

      mockOrder.removeInstruction({
        Type: 'Test Type',
        Content: 'Test Content',
      });
      expect(mockOrder.Instructions.length).toEqual(0);

      mockOrder.addInstruction({ Type: 'Test Type', Content: 'Test Content' });
      expect(mockOrder.Instructions.length).toEqual(1);
      expect(mockOrder.Instructions[0].Type).toEqual('Test Type');
      expect(mockOrder.Instructions[0].Content).toEqual('Test Content');

      mockOrder.removeInstruction(0);
      expect(mockOrder.Instructions.length).toEqual(0);
    });

    it('attachFile', function () {
      var file = { FileType: 'Artwork' };

      mockOrder = new Order({ Id: 1 });
      mockOrder.attachFile(file);

      $httpBackend.expectPOST('/api/v1/orders/1/artwork');
    });

    describe('savePartialOrder', function () {
      describe('POST', function () {
        it('LineItem', function () {
          var item = new LineItem({ Type: 'product' });

          mockOrder = new Order({
            Id: 1,
            LineItems: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPOST('/api/v1/orders/1/lineitems', item);
        });

        it('ProductLineItem', function () {
          var item = new ProductLineItem();

          mockOrder = new Order({
            Id: 1,
            LineItems: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPOST('/api/v1/orders/1/lineitems', item);
        });

        it('ServiceCharge', function () {
          var item = new ServiceCharge();

          mockOrder = new Order({
            Id: 1,
            LineItems: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPOST('/api/v1/orders/1/lineitems', item);
        });

        it('TitleLineItem', function () {
          var item = new TitleLineItem();

          mockOrder = new Order({
            Id: 1,
            LineItems: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPOST('/api/v1/orders/1/lineitems', item);
        });

        it('OrderNote', function () {
          var item = new OrderNote();

          mockOrder = new Order({
            Id: 1,
            OrderNotes: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPOST('/api/v1/orders/1/notes', item);
        });

        it('Payment', function () {
          var item = new Payment();

          mockOrder = new Order({
            Id: 1,
            Payments: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPOST('/api/v1/orders/1/payments', item);
        });
      });

      describe('PUT', function () {
        it('LineItem', function () {
          var item = new LineItem({ Id: 1 });

          mockOrder = new Order({
            Id: 2,
            LineItems: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPUT('/api/v1/orders/2/lineitems/1');
        });

        it('ProductLineItem', function () {
          var item = new ProductLineItem({ Id: 1 });

          mockOrder = new Order({
            Id: 2,
            LineItems: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPUT('/api/v1/orders/2/lineitems/1');
        });

        it('ServiceCharge', function () {
          var item = new ServiceCharge({ Id: 1 });

          mockOrder = new Order({
            Id: 2,
            LineItems: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPUT('/api/v1/orders/2/lineitems/1');
        });

        it('TitleLineItem', function () {
          var item = new TitleLineItem({ Id: 1 });

          mockOrder = new Order({
            Id: 2,
            LineItems: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPUT('/api/v1/orders/2/lineitems/1');
        });

        it('OrderNote', function () {
          var item = new OrderNote({ Id: 1 });

          mockOrder = new Order({
            Id: 2,
            OrderNotes: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPUT('/api/v1/orders/2/lineitems/1');
        });

        it('Payment', function () {
          var item = new Payment({ Id: 1 });

          mockOrder = new Order({
            Id: 2,
            Payments: [item],
          });

          mockOrder.savePartialOrder(item);

          $httpBackend.expectPUT('/api/v1/orders/2/lineitems/1');
        });
      });
    });

    describe('deletePartialOrder', function () {
      it('LineItem', function () {
        var item = new LineItem({ Id: 1 });

        mockOrder = new Order({
          Id: 2,
          LineItems: [item],
        });

        mockOrder.deletePartialOrder(item);

        $httpBackend.expectDELETE('/api/v1/orders/2/lineitems/1');
      });

      it('ProductLineItem', function () {
        var item = new ProductLineItem({ Id: 1 });

        mockOrder = new Order({
          Id: 2,
          LineItems: [item],
        });

        mockOrder.deletePartialOrder(item);

        $httpBackend.expectDELETE('/api/v1/orders/2/lineitems/1');
      });

      it('ServiceCharge', function () {
        var item = new ServiceCharge({ Id: 1 });

        mockOrder = new Order({
          Id: 2,
          LineItems: [item],
        });

        mockOrder.deletePartialOrder(item);

        $httpBackend.expectDELETE('/api/v1/orders/2/lineitems/1');
      });

      it('TitleLineItem', function () {
        var item = new TitleLineItem({ Id: 1 });

        mockOrder = new Order({
          Id: 2,
          LineItems: [item],
        });

        mockOrder.deletePartialOrder(item);

        $httpBackend.expectDELETE('/api/v1/orders/2/lineitems/1');
      });

      it('OrderNote', function () {
        var item = new OrderNote({ Id: 1 });

        mockOrder = new Order({
          Id: 2,
          OrderNotes: [item],
        });

        mockOrder.deletePartialOrder(item);

        $httpBackend.expectDELETE('/api/v1/orders/2/notes/1');
      });

      it('Payment', function () {
        var item = new Payment({ Id: 1 });

        mockOrder = new Order({
          Id: 2,
          Payments: [item],
        });

        mockOrder.deletePartialOrder(item);

        $httpBackend.expectDELETE('/api/v1/orders/2/payments/1');
      });
    });

    it('addMediaLink', function () {
      var link = {
        DownloadFileName: 'Test',
        DownloadFileUrl: 'Test',
        FileType: 'Artwork',
        FileUrl: 'http://google.com',
        MediaId: 'Test',
        OnDiskFileName: 'Test',
        OriginalFileName: 'Test',
        Extension: 'Test',
      };

      mockOrder.addMediaLink([link]);
      expect(mockOrder.MediaLinks.length).toEqual(1);
      mockOrder.addMediaLink(new MediaLink(link));
      expect(mockOrder.MediaLinks.length).toEqual(1);
      mockOrder.addMediaLink(link);
      expect(mockOrder.MediaLinks.length).toEqual(1);
      expect(mockOrder.Artwork.length).toEqual(1);
      expect(mockOrder.Artwork[0].FileType).toEqual('Artwork');
      expect(mockOrder.Artwork[0].FileUrl).toEqual('http://google.com');
    });

    it('removeMediaLink', function () {
      var link = { MediaId: 1 };
      mockOrder = new Order({
        LineItems: [{ Decorations: [{ Artwork: [{ MediaId: 1 }] }] }],
      });

      mockOrder.addMediaLink(link);
      expect(mockOrder.MediaLinks.length).toEqual(1);

      mockOrder.removeMediaLink(link);
      expect(mockOrder.MediaLinks.length).toEqual(0);
      expect(mockOrder.Artwork.length).toEqual(0);
    });

    xit('updateIsEditable', function () {
      mockOrder = new Order();

      mockOrder.Status = { Kind: 1 }; // open
      mockOrder.updateIsEditable();
      expect(mockOrder.IsEditable).toEqual(true);

      mockOrder.Status = { Kind: 2 }; // closed
      mockOrder.updateIsEditable();
      expect(mockOrder.IsEditable).toEqual(true);

      mockOrder.Status = { Kind: 3 }; // custom
      mockOrder.updateIsEditable();
      expect(mockOrder.IsEditable).toEqual(true);

      mockOrder.Status = { Kind: 4 }; // locked
      mockOrder.updateIsEditable();

      expect(mockOrder.IsEditable).toEqual(false);
      mockOrder.Status = { Kind: 5 }; // admin only
      mockOrder.updateIsEditable();
      expect(mockOrder.sIsEditable).toEqual(false);
    });

    it('getDocumentUrl', function () {
      var url;

      url = Order.getDocumentUrl(mockOrder, '', '', {}, false, 0);
      expect(angular.isUndefined(url)).toBeTruthy();

      mockOrder = new Order({ Id: 1 });

      url = Order.getDocumentUrl(mockOrder, 'pdf', 'order', { Id: 2 }, true, 3);
      expect(url).toEqual(
        '/orders/1/pdf?documentType=order&supplierId=2&dl=true&po=3'
      );

      url = Order.getDocumentUrl(
        mockOrder,
        'pdf',
        undefined,
        { Id: 2 },
        true,
        3
      );
      expect(url).toEqual('/orders/1/pdf?supplierId=2&dl=true&po=3');

      url = Order.getDocumentUrl(mockOrder, 'pdf', 'order', {}, true, 3);
      expect(url).toEqual('/orders/1/pdf?documentType=order&dl=true&po=3');

      url = Order.getDocumentUrl(
        mockOrder,
        'pdf',
        'order',
        { Id: 2 },
        false,
        3
      );
      expect(url).toEqual('/orders/1/pdf?documentType=order&supplierId=2&po=3');

      url = Order.getDocumentUrl(
        mockOrder,
        'pdf',
        'order',
        { Id: 2 },
        true,
        undefined
      );
      expect(url).toEqual(
        '/orders/1/pdf?documentType=order&supplierId=2&dl=true'
      );
    });

    describe('PreSave', function () {
      it('Invoice AcknowledgementContact', function () {
        mockOrder = {
          data: new Order({
            Type: 'invoice',
            AcknowledgementContact: {},
          }),
        };

        expect(mockOrder.data.AcknowledgementContact).not.toEqual(undefined);

        Order.preSave(mockOrder);
        expect(mockOrder.data.AcknowledgementContact).toEqual(undefined);
      });

      it('SampleRequest Contacts', function () {
        mockOrder = {
          data: new Order({
            Type: 'samplerequest',
            AcknowledgementContact: {},
            BillingContact: {},
          }),
        };

        expect(mockOrder.data.AcknowledgementContact).not.toEqual(undefined);
        expect(mockOrder.data.BillingContact).not.toEqual(undefined);

        Order.preSave(mockOrder);

        // Commented out these assertions because OrderModel deletes [Acknowledgement]Contact.address, not the entire object. -- Kevin 4/13/2018
        // expect(mockOrder.data.AcknowledgementContact).toEqual(undefined);
        // expect(mockOrder.data.BillingContact).toEqual(undefined);
      });

      it('SampleRequest Instructions', function () {
        mockOrder = {
          data: new Order({
            Type: 'samplerequest',
          }),
        };

        mockOrder.data.addInstruction(undefined);
        // Order was instantiated without instructions, default is []. Changed 2 to 1 because only added 1 instruction. - Kevin 4/13/2018
        expect(mockOrder.data.Instructions.length).toEqual(1); // 2

        Order.preSave(mockOrder);
        expect(mockOrder.data.Instructions.length).toEqual(0);
      });

      it('Instructions', function () {
        mockOrder = { data: new Order() };

        mockOrder.data.addInstruction(undefined);
        expect(mockOrder.data.Instructions.length).toEqual(1);

        Order.preSave(mockOrder);
        expect(mockOrder.data.Instructions.length).toEqual(0);
      });

      it('Notes', function () {
        mockOrder = { data: new Order() };

        mockOrder.data.addNote(undefined);
        expect(mockOrder.data.Notes.length).toEqual(1);

        Order.preSave(mockOrder);
        expect(mockOrder.data.Notes.length).toEqual(0);
      });

      it('Contacts', function () {
        mockOrder = {
          data: new Order({
            BillingContact: { Address: { IsPrimary: true } },
            ShippingContact: { Address: { IsPrimary: true } },
            AcknowledgementContact: { Address: { IsPrimary: true } },
          }),
        };

        expect(mockOrder.data.BillingContact.Address).not.toEqual(undefined);
        expect(mockOrder.data.ShippingContact.Address).not.toEqual(undefined);
        expect(mockOrder.data.AcknowledgementContact.Address).not.toEqual(
          undefined
        );

        Order.preSave(mockOrder);
        expect(mockOrder.data.BillingContact.Address).toEqual(undefined);
        expect(mockOrder.data.ShippingContact.Address).toEqual(undefined);
        expect(mockOrder.data.AcknowledgementContact.Address).toEqual(
          undefined
        );
      });

      it('Currencies', function () {
        mockOrder = {
          data: new Order({
            Currencies: [{ ConversionRate: 0 }, { ConversionRate: 10 }],
          }),
        };

        expect(mockOrder.data.Currencies.length).toEqual(4);
        expect(mockOrder.data.Currencies[0].ConversionRate).toEqual(0);
        expect(mockOrder.data.Currencies[1].ConversionRate).toEqual(10);

        Order.preSave(mockOrder);
        expect(mockOrder.data.Currencies.length).toEqual(1);
        expect(mockOrder.data.Currencies[0].ConversionRate).toEqual(10);
      });

      it('CreditTerm', function () {
        mockOrder = { data: new Order() };

        mockOrder.data.CreditTerm = null;
        Order.preSave(mockOrder);
        expect(mockOrder.data.CreditTerm).toEqual(null);

        mockOrder.data.CreditTerm = undefined;
        Order.preSave(mockOrder);
        expect(mockOrder.data.CreditTerm).toEqual(null);
      });

      it('PaymentMethod', function () {
        mockOrder = { data: new Order() };

        mockOrder.data.PaymentMethod = null;
        Order.preSave(mockOrder);
        expect(mockOrder.data.PaymentMethod).toEqual(null);

        mockOrder.data.PaymentMethod = undefined;
        Order.preSave(mockOrder);
        expect(mockOrder.data.PaymentMethod).toEqual(null);
      });
    });

    describe('updateProductsConfiguredStatus', function () {
      it('sets AllProductsConfigured to true if all products configured', function () {
        mockOrder = new Order();

        expect(mockOrder.AllProductsConfigured).toBeTruthy();

        mockOrder.addLineItem({ Type: 'service' });

        expect(mockOrder.AllProductsConfigured).toBeTruthy();

        mockOrder.addLineItem({ Type: 'product' });

        expect(mockOrder.AllProductsConfigured).toBeTruthy();
      });

      it('sets AllProductsConfigured to false if not all products are configured', function () {
        mockOrder = new Order();

        expect(mockOrder.AllProductsConfigured).toBeTruthy();

        mockOrder.addLineItem({ Id: 1, Type: 'product' });

        expect(mockOrder.AllProductsConfigured).toBeFalsy();
      });
    });

    function mapDate(val) {
      if (val) {
        if (val instanceof moment) {
          return val.clone();
        }

        return moment.utc(val);
      }

      return null;
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
  });
})();
