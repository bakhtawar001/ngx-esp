import { RecentlyViewedStateModel, RecentlyViewedTypes } from '../states/model';

export class AddEntity<T extends RecentlyViewedTypes> {
  static type = '[EspRecentlyViewed] Add Entity' as const;
  constructor(
    public entityType: T,
    public recentEntity: RecentlyViewedStateModel[T][number]
  ) {}
}
