export const enum OrderStatusKind {
  Open = 'Open', // 1
  Closed = 'Closed', // 2
  Custom = 'Custom', // 3
  Locked = 'Locked', // 4
  AdminOnly = 'AdminOnly', //5
  AgeLimitFail = 'AgeLimitFail', // 6
  CreditFail = 'CreditFail', // 7
}

export interface OrderStatusType {
  Label: string;
  Color: string;
  TenantId: number;
  Kind: OrderStatusKind;
  OwnerId: number;
  Id: number;
  Note?: string;
}
