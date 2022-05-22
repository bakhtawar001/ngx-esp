import { ProductAttribute } from './product-attribute.model';

export declare interface DecorationLineItemDetail {
  Id: number;
  VariantLinkType: string;
  Variants: string[];
  LogoSize: ProductAttribute;
  LogoColors: ProductAttribute[];
  InstructionsVisible: boolean;
  Instructions: string;
}
