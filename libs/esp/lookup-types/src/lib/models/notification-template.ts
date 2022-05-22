import { Entity } from '@esp/models';

export declare enum AppAccessType {
  All = 0,
  Crm = 1,
  Orders = 2,
  SOP = 3,
  EmailMarketing = 4,
}

export declare enum NotificationCustomizationType {
  Allow = 0,
  Disallow = 1,
  RequireOne = 2,
}

export declare interface NotificationTemplateType extends Entity {
  code: string;
  eventGroup: string;
  eventText: string;
  customizationType: NotificationCustomizationType;
  accessCode: string;
  sequence: number;
  groupSequence: number;
  typeCode: string;
  accessType: AppAccessType;
}
