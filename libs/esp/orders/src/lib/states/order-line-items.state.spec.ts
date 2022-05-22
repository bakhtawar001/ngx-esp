import { OrderLineItemsState } from './order-line-items.state';

describe(OrderLineItemsState.name, () => {
  function setup() {
    return {};
  }
  it(`Test`, () => {
    // Arrange
    const {} = setup();
    // Act
    // Assert
  });

  /*

  describe('updateLineItem', () => {
    it('calls updateLineItem + dispatches UpdateLineItemSuccess', () => {
      const returnValue = null;
      const updateValue = new LineItem();
      const updateIndex = 0;
      const order = OrdersMockDb.orders[0];

      store.reset({ orders: { order } });

      const updateSpy = spyOn(ordersService, 'updateLineItem').and.returnValue(
        of(returnValue)
      );
      const dispatchSpy = spyOn(store, 'dispatch');

      ordersFacade.updateLineItem(updateValue, updateIndex);

      expect(updateSpy).toHaveBeenCalledWith(order.Id, updateValue);

      expect(dispatchSpy).toHaveBeenCalledWith(
        new UpdateLineItemSuccess(returnValue, updateIndex)
      );
    });
  });

  describe('addLineItem', () => {
    let order;
    let saveSpy;
    let dispatchSpy;
    let lineItem;

    beforeEach(() => {
      order = OrdersMockDb.orders[0];
      saveSpy = spyOn(ordersService, 'save').and.returnValue(of(order));
      dispatchSpy = spyOn(store, 'dispatch');
      lineItem = new LineItem();
    });

    it('adds LineItems array', () => {
      delete order.LineItems;

      store.reset({ orders: { order } });

      ordersFacade.addLineItem(lineItem);

      expect(saveSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(new AddLineItemSuccess(order));
    });
  });

  */
});
