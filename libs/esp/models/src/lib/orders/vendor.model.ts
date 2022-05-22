// TODO: Is this the same as Supplier in the SmartLink project?
export declare interface Vendor {
  Id: number;
  ExternalId?: number;
  Name: string;
  AsiNumber: string;
  IsSupplier: boolean;
  IsDecorator: boolean;
  IsAsiMember: boolean;
  // PrimaryEmail: EmailAccountView;
  // Emails: EmailAccountView[];
  PrimaryPhone: string;
}
