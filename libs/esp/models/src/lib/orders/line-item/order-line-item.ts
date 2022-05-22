import {
  ProductLineItem,
  ProductLineItemDomainModel,
} from './product-line-item.model';
import {
  ServiceLineItem,
  ServiceLineItemDomainModel,
} from './service-line-item.model';
import { TitleLineItem } from './title-line-item.model';

export type LineItem = ProductLineItem | ServiceLineItem | TitleLineItem;

export type OrderLineItemDomainModel =
  | ProductLineItemDomainModel
  | ServiceLineItemDomainModel
  | TitleLineItem;
