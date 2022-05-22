import { Entity, Shareable } from '../common';
import { Customer } from './customer.model';

export interface BaseProject extends Entity, Shareable {
  Budget?: number;
  CreateDate?: Date;
  Customer: Customer;
  Description?: string;
  InHandsDate: Date;
  IsActive?: boolean;
  IsInHandsDateFlexible?: boolean;
}
