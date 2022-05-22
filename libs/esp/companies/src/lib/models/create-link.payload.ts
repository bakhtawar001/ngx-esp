import { LinkRelationship } from '@esp/models';

export interface CreateLinkPayload {
  link: LinkRelationship;
  companyId: number;
}
