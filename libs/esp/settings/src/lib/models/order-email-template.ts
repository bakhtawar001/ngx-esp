export class SimpleParty {
  Id: number;
  Name: string;
  Address: any;
  Email: string;
  EmailType: string;
  Phone: string;
  IsCompany: boolean;
  IsPerson: boolean;
  IsUser: boolean;
  ExternalRecordId: string;
  Links: SimpleParty[];
}

export class OrderEmailTemplate {
  ReplyTo: string;
  CC: SimpleParty[];
  AllowCustomSignature: boolean;
  Type: string;
  Subject: string;
  Header: string;
  Body: string;
  Signature: string;
  Footer: string;
}
