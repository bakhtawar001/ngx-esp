import { FormatPricePipe } from './format-price.pipe';

describe('FormatPricePipe', () => {
  let pipe: FormatPricePipe;
  let price;

  beforeEach(() => {
    pipe = new FormatPricePipe();

    price = {
      Cost: 1.11,
      CurrencyCode: 'USD',
      Quantity: 100,
    };
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('slices empty (0) thousandths place', () => {
    const val = pipe.transform(price, 'Cost');

    expect(val).toEqual('$1.11');
  });

  it('slices empty (0) thousandths place', () => {
    price.Cost = 1.11;

    const val = pipe.transform(price, 'Cost');

    expect(val).toEqual('$1.11');
  });

  it('Formats CAD', () => {
    price.CurrencyCode = 'CAD';

    const val = pipe.transform(price, 'Cost');

    expect(val).toEqual('C$1.11');
  });

  it('Shows quantity', () => {
    const val = pipe.transform(price, 'Cost', true);

    expect(val).toEqual('100 @ $1.11');
  });

  it('Uses default quantity of 1', () => {
    delete price.Quantity;

    const val = pipe.transform(price, 'Cost', true);

    expect(val).toEqual('1 @ $1.11');
  });
});
