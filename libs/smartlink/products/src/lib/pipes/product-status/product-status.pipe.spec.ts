import { ProductSearchResultItem } from '@smartlink/models';
import { ProductStatusPipe } from './product-status.pipe';

describe('ProductStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new ProductStatusPipe();
    expect(pipe).toBeTruthy();
  });

  it(`returns a 'Most Popular' label in an object if the Ad.Type is MTP`, () => {
    const product: Partial<ProductSearchResultItem> = {
      Ad: {
        Type: 'MTP',
      },
    };
    const pipe = new ProductStatusPipe();
    const pipeResult = pipe.transform(product as ProductSearchResultItem);
    expect(pipeResult).toEqual({
      Label: 'Most Popular',
      Color: 'blue',
      Type: 'MTP',
    });
  });

  it(`returns a 'null' object if the Ad.Type isn't MPT`, () => {
    const product: Partial<ProductSearchResultItem> = {
      Ad: {
        Type: 'other',
      },
    };
    const pipe = new ProductStatusPipe();
    const pipeResult = pipe.transform(product as ProductSearchResultItem);
    expect(pipeResult).toEqual(null);
  });
});
