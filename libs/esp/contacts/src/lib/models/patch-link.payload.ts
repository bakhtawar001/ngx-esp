import { LinkRelationship } from '@esp/models';

export interface PatchLinkPayload {
  contactId: number;
  linkId: number;
  link: LinkRelationship;
}
