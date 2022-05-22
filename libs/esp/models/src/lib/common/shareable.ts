import { Collaborator } from './collaborator';

export type AccessLevel = 'Everyone' | 'Owner' | 'Custom';

export type PermissionAccessLevel = 'Everyone' | 'User' | 'Team';

export type AccessType = 'ReadWrite' | 'Read';

export interface AccessPermission {
  AccessLevel?: PermissionAccessLevel;
  AccessType?: AccessType;
  EntityId?: number;
}

export interface Shareable {
  TenantId?: number;
  OwnerId?: number;
  Owner?: any;
  AccessLevel?: AccessLevel;
  Access?: AccessPermission[];
  Collaborators?: Collaborator[];
  IsVisible?: boolean;
  IsEditable?: boolean;
}
