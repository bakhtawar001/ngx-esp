import { LookupApiModel } from '../services';
import { TagType } from './tag-type';
import { LinkRelationshipTypeView } from './link-relationship-type';

export interface Lookups extends Partial<LookupApiModel> {
  TagTypes?: TagType[];
  Relationships?: LinkRelationshipTypeView[];
}

export type LookupTypeKey = keyof Lookups;
