import { CollectionProduct } from '@esp/collections';
import { getRandomNumbers, randomStringGenerator } from '../../../utils';

export const generateCollectionProduct = (
  data?: Partial<CollectionProduct>
): CollectionProduct => ({
  Id: getRandomNumbers(4, 1)[0],
  Name: randomStringGenerator(5),
  Description: 'string',
  ImageUrl: 'string',
  ProductId: 2100,
  ...data,
});
