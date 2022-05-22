import { Project, ProjectStepName } from '@esp/models';

export const generateProject = (data?: Partial<Project>): Project => ({
  Name: 'Automation Project',
  Customer: {
    Id: 5,
    Name: 'string',
    Types: ['Customer', 'Supplier', 'Decorator'],
  },
  EventType: 'Client Appreciation',
  Budget: 0.0,
  CurrencyTypeCode: 'USD',
  InHandsDate: new Date(),
  EventDate: new Date(),
  StatusStep: 0,
  StatusName: ProjectStepName.NegotiatingAndPitching,
  NumberOfAssignees: 958,
  IsActive: true,
  Contacts: [],
  CreateDate: new Date(),
  Owner: { Id: 0, Name: 'Project Owner Name' },
  AccessLevel: 'Everyone',
  Access: [{ AccessLevel: 'Everyone', EntityId: 0, AccessType: 'ReadWrite' }],
  IsVisible: true,
  IsEditable: true,
  ...data,
});
