import { LinkRelationship } from '@esp/models';

export interface PatchLinkPayload {
  link: LinkRelationship;
  companyId: number;
  linkId: number;
}
