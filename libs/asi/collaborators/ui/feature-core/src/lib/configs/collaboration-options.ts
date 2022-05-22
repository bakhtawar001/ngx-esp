import { AccessLevel } from '@esp/models';

export interface CollaborationOption<T> {
  Name: string;
  Description: string;
  Value?: T;
}

export const collaborationOptions: CollaborationOption<AccessLevel>[] = [
  {
    Value: 'Owner',
    Name: 'Only the Owner',
    Description: 'Only the owner and admin can edit and view',
  },
  {
    Value: 'Everyone',
    Name: 'Everyone within your company',
    Description: 'Anyone in your company can edit or view',
  },
  {
    Value: 'Custom',
    Name: 'Selected individuals',
    Description: 'Only people who are selected can edit or view',
  },
];
