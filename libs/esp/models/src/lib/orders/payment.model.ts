export declare interface Payment {
  Id: number;
  Method: string;
  Amount: number;
  ConvertedAmount: number;
  Date: string;
  IsFullPayment: boolean;
  Note: string;
  Number: string;
  CurrencyCode: string;
  ProcessorTransactionId: string;
  ProcessorResponse: string;
}
