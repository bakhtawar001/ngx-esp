import { Shareable } from '../common';
import { Party } from '../parties';

export interface Note extends Shareable {
  Id: number;
  Content: string;
  Type: string;
  UserName: string;
  CreateDate: string;
  CreatedBy: string;
  UpdateDate: string;
  UpdatedBy: string;
  Links: Party[];
}
