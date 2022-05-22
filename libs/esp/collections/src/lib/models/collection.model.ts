import { Entity, Shareable } from '@esp/models';

import { CollectionProduct } from './collection-product.model';

export type CollectionStatus = 'Active' | 'Archived';

export interface Collection extends Shareable, Entity {
  CreateDate?: string;
  CreatedBy?: null | string;
  Description?: null | string;
  Emoji?: null | string;
  IsEditable?: null | boolean;
  IsVisible?: null | boolean;
  Products?: null | Array<CollectionProduct>;
  Status?: null | CollectionStatus;
  TenantId?: null | number;
  UpdateDate?: null | string;
  UpdatedBy?: null | string;
}
