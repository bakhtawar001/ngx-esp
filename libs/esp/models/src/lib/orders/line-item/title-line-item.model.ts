import { IAuditable } from '../../common';
import { RootLineItem } from './_line-item-shared.model';

export interface TitleLineItem extends RootLineItem, IAuditable {
  Id: number;
  Type: 'title';
}
