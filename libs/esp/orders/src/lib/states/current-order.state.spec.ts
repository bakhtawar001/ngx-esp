import { CurrentOrderState } from './current-order.state';

describe(CurrentOrderState.name, () => {
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

  describe('getById', () => {
    it('calls orders.get and dispatches GetOrderByIdSuccess', () => {
      const order = OrdersMockDb.orders[0];

      const getSpy = spyOn(ordersService, 'get').and.returnValue(of(order));
      const dispatchSpy = spyOn(store, 'dispatch');

      ordersFacade.getById(order.Id);

      expect(getSpy).toHaveBeenCalledWith(order.Id);
      expect(dispatchSpy).toHaveBeenCalledWith(new GetOrderByIdSuccess(order));
    });

    it('adds order to recently viewed', () => {
      const order = OrdersMockDb.orders[0];

      spyOn(ordersService, 'get').and.returnValue(of(order));

      const recentlyViewedSpy = spyOn(recentlyViewedFacade, 'addOrder');

      ordersFacade.getById(order.Id);

      expect(recentlyViewedSpy).toHaveBeenCalledWith(order);
    });
  });
  */
});
