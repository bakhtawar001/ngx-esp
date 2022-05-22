export interface AccountInformation {
  Id: number;
  Username: string;
  FirstName: string;
  LastName: string;
  Organization: {
    Id: string;
    Name: string;
    AsiNumber: string;
    Type: string;
    IsInternal: boolean;
  };
  Address: {
    Street1: string;
    City: string;
    State: string;
    Zip: string;
    Country: string;
  };
  Phone: {
    Work?: string;
  };
  Email: string;
  Preferences: {
    ShowNetCost: boolean;
    ShowSupplierInfo: boolean;
    ProfileImage: string;
    VirtualSampleSettings: string;
    CurrencyCode: string;
    ConversionRates: ConversionRate[];
    LogoId: number;
  };
  HasConsented: boolean;
  Clipboard: {
    Count: number;
  };
  StartupApplication: {
    Id: string;
    Code: string;
    Version: string;
    Url: string;
  };
  Gravatar: string;
  DefaultMarketSegment: string;
  IsAdmin: boolean;
}

export interface ConversionRate {
  CurrencyCode: string;
  ConversionRate: number;
}

export interface AccountInformationParams {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  preferences?: string;
}
