export class CurrencyConversion {
  Id: number;
  SourceType: string;
  TargetType: string;
  ConversionRate: number;
}

export class CurrencyPreferences {
  DefaultCurrencyCode: string;
  Conversions: CurrencyConversion[];
}
