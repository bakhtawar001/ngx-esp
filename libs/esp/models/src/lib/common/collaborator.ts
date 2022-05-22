import { Entity } from '../common';
import { AccessType } from './shareable';

export type CollaboratorRole = 'Owner' | 'Administrator' | 'User' | 'Team';

export interface Collaborator extends Entity {
  Email?: string;
  ImageUrl?: string;
  IconImageUrl?: string;
  IsTeam?: boolean;
  TeamId?: number;
  Role: CollaboratorRole;
  UserId: number;
  AccessType?: AccessType;
}
