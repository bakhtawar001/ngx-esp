import { IAuditable } from '../common';

export interface OrderNote extends IAuditable {
  Id: number;
  Content: string;
  UserId: number;
  IsEditable: boolean;
  UserName: string;
  CreateDate: string;
  CreatedBy: string;
  UpdateDate?: string;
  UpdatedBy: string;
}
