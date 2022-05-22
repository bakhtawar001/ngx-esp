import { Shareable } from '@esp/models';

import { CollectionStatus } from '../collection.model';

export interface CollectionSearch extends Shareable {
  Id: number;
  Name: string;
  Description: string;
  Status: CollectionStatus;

  Products?: any[];
  Emoji: string;
  CreateDate: string;
  CreatedBy: string;
  UpdateDate: string;
  UpdatedBy: string;
}
