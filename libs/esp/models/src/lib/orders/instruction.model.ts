import { IAuditable } from '../common';

export interface Instruction extends IAuditable {
  Id: number;
  Content: string;
  Type: string;
  CreateDate: string;
  CreatedBy: string;
  UpdateDate?: string;
  UpdatedBy: string;
}
