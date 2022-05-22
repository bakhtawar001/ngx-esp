export type ProjectDetailsForm = {
  Name: string;
  Type: string;
  EventType: string;
  EventDate: Date;
  InHandsDate: Date;
  Budget: string;
  NumberOfAssignees: string;
  IsInHandsDateFlexible?: boolean;
};

export const defaultProjectDetailsFormValue: ProjectDetailsForm = {
  Name: '',
  Type: '',
  EventType: '',
  EventDate: null,
  InHandsDate: null,
  Budget: '',
  NumberOfAssignees: '',
};
