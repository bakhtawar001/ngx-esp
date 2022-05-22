export interface FinancialDetails {
  Currency?: string;
  CreditTerms: string[];
  IsEditable?: boolean;
  IsTaxExempt: boolean;
  MinimumMargin?: number;
  SalesTarget?: number;
}
