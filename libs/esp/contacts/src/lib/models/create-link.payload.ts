import { LinkRelationship } from '@esp/models';

export interface CreateLinkPayload {
  contactId: number;
  link: LinkRelationship;
}
