export interface SocialMediaFormModel {
  Facebook: string;
  Instagram: string;
  LinkedIn: string;
  Pinterest: string;
  Twitter: string;
  Other: string;
}

export enum SocialMediaFormPrefix {
  Facebook = 'www.facebook.com/',
  Instagram = '@',
  LinkedIn = 'www.linkedin.com/',
  Pinterest = '@',
  Twitter = '@',
  Other = '',
}
