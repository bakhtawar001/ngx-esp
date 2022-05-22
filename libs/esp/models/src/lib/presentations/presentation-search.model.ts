import { Entity } from '@smartlink/common';
import { Shareable } from '../common';
import { Customer } from '../projects';

export interface PresentationSearch extends Shareable, Entity {
  Description: string;
  Customer: Customer;
  UpdateDate?: string;
  CreateDate?: string;
  Products: { Id: number; ImageUrl?: string; ProductId?: number }[];
  ProductCount: number;
  Project: {
    Id: number;
    Name: string;
  };
}
