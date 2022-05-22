import { MediaLink } from '../orders';
import { Website } from './website.model';

export interface BrandInformation {
  PrimaryBrandColor?: string;
  LogoMediaLink?: MediaLink;
  IconMediaLink?: MediaLink;
  Website?: Website;
}
