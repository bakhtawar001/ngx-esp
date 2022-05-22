export interface TrackEventData {
  appCode?: string;
  appId?: number;
  pageUrlName?: string;
  referrerPageUrlName?: string;
}

export interface TrackEvent<T extends TrackEventData> {
  action: string;
  properties: T;
}
