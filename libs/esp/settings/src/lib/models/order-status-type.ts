export enum OrderStatusTypeKind {
  Open = 1,
  Closed = 2,
  Custom = 3,
  Locked = 4,
  AdminOnly = 5,
  CreditFail = 6,
  AgeLimitFail = 7,
}

export class OrderStatusType {
  Label: string;
  Color: string;
  Note: string;
  TenantId: number;
  Kind: OrderStatusTypeKind;
  OwnerId: number;
  Id: number;
}
