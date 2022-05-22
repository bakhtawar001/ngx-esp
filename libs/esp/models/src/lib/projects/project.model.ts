import { Customer } from './customer.model';
import { BaseProject } from './base-project.model';
export interface Project extends BaseProject {
  EventType: string;
  EventDate: Date;
  StatusStep?: number;
  StatusName?: ProjectStepName;
  Contacts?: Customer[];
  CurrencyTypeCode?: string;
  NumberOfAssignees?: number;
}

export enum ProjectStepName {
  NegotiatingAndPitching = 'Negotiating and Pitching',
  ProcessingAndFulfillment = 'Processing and Fulfillment',
  Closed = 'Closed',
}

// This is used for displaying status in a format that is required by client. Api returns value with `and`, but status should be displayed with `&`
export enum ProjectStepDisplayValue {
  'Negotiating and Pitching' = 'Negotiating & Pitching',
  'Processing and Fulfillment' = 'Processing & Fulfillment',
  Closed = 'Closed',
}
