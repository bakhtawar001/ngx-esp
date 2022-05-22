import { Entity, Shareable } from '../common';
import { Note } from '../notes';
import { OrderSearch } from '../orders';
import { Party } from '../parties';

export interface Task extends Shareable {
  Id?: number;
  Name: string;
  Type: string;
  Visibility: string;
  Progress?: number;
  Priority: string;
  Recurrence: string;
  Status: string;
  Description: string;
  DueDate?: string;
  StartDate?: string;
  AssignedTo?: Entity;
  Links: Party[];
  OwnerName: string;
  UpdateDate?: string;
  SendReminder: boolean;
  OrderId?: OrderSearch['Id'];
  OrderNumber?: OrderSearch['Number'];
  InHandsDate?: string;
  Product?: string;
  IsDeleted: boolean;
  Notes?: Note[];
  CompletedByUserName: string;
  CompletedByUserId?: number;
  CompletedDate?: string;
}
