import { ShareableSearch } from '../../common';
import { OrderSearch } from '../../orders';

export interface TaskSearch extends ShareableSearch {
  Id: number;
  Name: string;
  Type: string;
  Progress: number;
  Priority: string;
  Status: string;
  Description: string;
  DueDate?: string;
  UserId?: number;
  UserName: string;
  TeamId?: number;
  TeamName: string;
  PartyIds: number[];
  UpdateDate?: string;
  Product: string;
  Companies: string[];
  Order: OrderSearch;
  IsDeleted: boolean;
  Note: string;
  NoteCount: number;
  CompletedByUserName: string;
  CompletedByUserId?: number;
  CompletedDate?: string;
}
