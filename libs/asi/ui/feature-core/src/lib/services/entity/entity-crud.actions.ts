import { InjectionToken, Type } from '@angular/core';

export const ENTITY_CRUD_ACTIONS = new InjectionToken<EntityCrudActions>(
  'entity crud actions'
);

export interface EntityCrudActions {
  create?: Type<unknown>;
  delete?: Type<unknown>;
  transferOwnership?: Type<unknown>;
  update?: Type<unknown>;
}
