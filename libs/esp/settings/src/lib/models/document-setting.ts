export class DocumentSetting {
  TenantId: number;
  DocumentTypeSettings: DocumentTypeSetting[];
  ImageUrl: string;
  OriginalImageName: string;
  Title: string;
  UseNewFormat: boolean;
  CreateDate: string;
  CreateOffset: string;
  CreatedBy: string;
  UpdateDate: string;
  UpdateOffset: string;
  UpdatedBy: string;
  AuditId: string;
  IpAddress: string;
  Signon_Id: number;
  Id: number;
}

export class DocumentTypeSetting {
  DocumentSetting_Id: number;
  DocumentSetting: DocumentSetting;
  DocumentType: string;
  Header: string;
  Footer: string;
  ShowDocumentImages: boolean;
  ShowCPN: boolean;
  ShowShippingContactPhone: boolean;
  ShowShippingContactEmail: boolean;
  ShowPOReference: boolean;
  ShowThirdPartyId: boolean;
  CreateDate: string;
  CreateOffset: string;
  CreatedBy: string;
  UpdateDate: string;
  UpdateOFfset: string;
  UpdatedBy: string;
  AuditId: string;
  IpAddress: string;
  Signon_Id: number;
  Id: number;
}

export type DesignSettingCode = keyof DocumentSetting;
