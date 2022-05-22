export enum NotificationTemplateTypeCode {
  AppointmentReminder = 0,
  AppointmentShared = 1,
  SalesOrderCreated = 2,
  OrderSent = 3,
  OrderNoteAdded = 4,
  OrderStatusChange = 5,
  TaskAssigned = 6,
  TaskDue = 7,
  TaskComplete = 8,
  NoteShared = 9,
  CompanyShared = 10,
  ContactShared = 11,
  ExportCompleted = 12,
  FileImportFailed = 13,
  FileImported = 14,
  SupplierPurchaseOrderUpdated = 15,
  SupplierPurchaseOrderShipDateUpdated = 16,
  SupplierPurchaseOrderDeliveryDateUpdated = 17,
  SupplierPurchaseOrderReceived = 18,
  ArbitraryNotification = 19,
  SupplierPurchaseOrderVendorStatusAdded = 20,
  PurchaseOrderStatusUpdated = 21,
  EmailReceived = 22,
  EmsFileImported = 23,
  OrderEmailOpened = 24,
  PresentationViewed = 25,
  ImportReady = 26,
  ImportExpiring = 27,
  PresentationEmailOpened = 28,
  PresentationEmailClicked = 29,
  PresentationCommented = 30,
  EmailClicked = 31,
  EmailOpened = 32,
  EmailBounced = 33,
  TenantAccessRevoked = 34,
  QboExpiring = 35,
  QboRenewed = 36,
}

export enum NotificationAlertType {
  None = 0,
  All = -1,
  Bus = 1,
  Email = 2,
}

export enum NotificationCustomizationType {
  Allow = 0,
  Disallow = 1,
  RequireOne = 2,
}

export enum AppAccessType {
  All = 0,
  Crm = 1,
  Orders = 2,
  SOP = 3,
  EmailMarketing = 4,
}

export class NotificationTemplateType {
  Code: string;
  EventGroup: string;
  EventText: string;
  CustomizationType: NotificationCustomizationType;
  AccessCode: string;
  Sequence: number;
  GroupSequence: number;
  TypeCode: NotificationTemplateTypeCode;
  AccessType: AppAccessType;
  Id: number;
}

export class NotificationSetting {
  TemplateTypeCode: string;
  AlertTypeCode: string;
  UserId: number;
  IsEnabled: boolean;
  Type: NotificationTemplateTypeCode;
  AlertType: NotificationAlertType;
  TemplateType: NotificationTemplateType;
  Id: number;
}
