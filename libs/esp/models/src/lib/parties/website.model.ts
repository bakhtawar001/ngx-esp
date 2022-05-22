export const enum WebsiteTypeEnum {
  Other = 'Other',
  Corporate = 'Corporate',
  Facebook = 'Facebook',
  GooglePlus = 'GooglePlus',
  LinkedIn = 'LinkedIn',
  Pinterest = 'Pinterest',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
}

export type SocialMediaWebsiteType =
  | WebsiteTypeEnum.Facebook
  | WebsiteTypeEnum.Instagram
  | WebsiteTypeEnum.LinkedIn
  | WebsiteTypeEnum.Pinterest
  | WebsiteTypeEnum.Twitter
  | WebsiteTypeEnum.Other;

export interface Website {
  Id?: number;
  IsPrimary: boolean;
  Type: WebsiteTypeEnum;
  Url: string;
}
