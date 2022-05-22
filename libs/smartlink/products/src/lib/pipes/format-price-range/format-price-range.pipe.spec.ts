import { FormatPriceRangePipe } from './format-price-range.pipe';

describe('FormatPriceRangePipe', () => {
  let pipe;
  let testProduct;

  beforeEach(() => {
    pipe = new FormatPriceRangePipe();

    testProduct = {
      LowestPrice: {
        Price: '1.44',
        CurrencyCode: 'USD',
        Quantity: 100,
      },
      HighestPrice: {
        Price: '100.32',
        CurrencyCode: 'USD',
        Quantity: 1,
      },
    };
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should display Price range as lowest price - highest price', () => {
    testProduct = {
      LowestPrice: {
        Price: '1.44',
        CurrencyCode: 'USD',
        Quantity: 100,
      },
      HighestPrice: {
        Price: '100.32',
        CurrencyCode: 'USD',
        Quantity: 1,
      },
    };
    const val = pipe.transform(testProduct);

    expect(val).toEqual(
      `$${testProduct.LowestPrice.Price} - $${testProduct.HighestPrice.Price}`
    );
  });

  it('should display QUR as price information when no low price or high price set', () => {
    testProduct = {};
    const val = pipe.transform(testProduct);

    expect(val).toEqual('QUR');
  });

  it('should display highest price point when last price is set to QUR', () => {
    testProduct = {
      LowestPrice: {
        isQUR: true,
        CurrencyCode: 'USD',
      },
      HighestPrice: {
        isQUR: false,
        Price: '100.32',
        CurrencyCode: 'USD',
        Quantity: 1,
      },
    };
    const val = pipe.transform(testProduct);

    expect(val).toEqual('$100.32');
  });

  it('should display QUR as price information when all price grids are set to QUR', () => {
    testProduct = {
      LowestPrice: {
        isQUR: true,
        CurrencyCode: 'USD',
      },
      HighestPrice: {
        isQUR: true,
        CurrencyCode: 'USD',
      },
    };
    const val = pipe.transform(testProduct);

    expect(val).toEqual('QUR');
  });

  it('should display price information when some price grids are set to QUR with quantity and pricing', () => {
    testProduct = {
      LowestPrice: {
        CurrencyCode: 'USD',
        IsQUR: true,
        Price: 100,
        Quantity: {
          From: 30,
          To: 2147483647,
        },
      },
      HighestPrice: {
        Cost: 55,
        CurrencyCode: 'USD',
        DiscountCode: 'Q',
        IsQUR: false,
        Price: 100,
      },
    };
    const val = pipe.transform(testProduct);

    expect(val).toEqual('$100.00');
  });

  it('returns price low if price high is the same', () => {
    testProduct.HighestPrice.Price = testProduct.LowestPrice.Price;
    testProduct.HighestPrice.Quantity = testProduct.LowestPrice.Quantity;

    const val = pipe.transform(testProduct);

    expect(val).toEqual(`$${testProduct.LowestPrice.Price}`);
  });

  it('returns removes price.low if cost is QUR', () => {
    testProduct.LowestPrice = '11';

    const val = pipe.transform(testProduct);

    expect(val).toEqual(`$${testProduct.HighestPrice.Price}`);
  });

  it('returns removes price.high if cost is QUR', () => {
    testProduct.HighestPrice = '11';

    const val = pipe.transform(testProduct);

    expect(val).toEqual(`$${testProduct.LowestPrice.Price}`);
  });
});
