import { Injectable } from '@angular/core';
import { RestClient } from '@esp/common/http';
import { Observable } from 'rxjs';
import {
  Carrier,
  CountryType,
  CreditTerm,
  CurrencyType,
  Decoration,
  Email,
  Event,
  InstantMessenger,
  Lookup,
  OrderStatusType,
  PaymentMethod,
  PhoneType,
  ProductAttribute,
  ServiceCharge,
  Setting,
  TemplateStatus,
  TemplateType,
  UnitOfMeasure,
} from '../models';

// This sample object is provided (and the types rather derived from it) so that
// we get the benefit of having a runtime object from which we can drive initial state
const lookupsApiSample = {
  Carriers: new Array<Carrier>(),
  Contacts: new Array<Lookup>(),
  Countries: new Array<CountryType>(),
  CreditTerms: new Array<CreditTerm>(),
  Currencies: new Array<CurrencyType>(),
  Decorations: new Array<Decoration>(),
  DecorationServiceCharges: new Array<Lookup>(),
  Emails: new Array<Email>(),
  Events: new Array<Event>(),
  Forms: new Array<Lookup>(),
  InstantMessengers: new Array<InstantMessenger>(),
  OrderStatuses: new Array<OrderStatusType>(),
  PaymentMethods: new Array<PaymentMethod>(),
  Phones: new Array<PhoneType>(),
  ProductAttributes: new Array<ProductAttribute>(),
  ProductCategories: new Array<Lookup>(),
  ProductServiceCharges: new Array<Lookup>(),
  Proofs: new Array<Lookup>(),
  QuoteForms: new Array<Lookup>(),
  Recurrences: new Array<Lookup>(),
  SearchSeedOptions: new Array<Lookup>(),
  ServiceCharges: new Array<ServiceCharge>(),
  Settings: new Array<Setting>(),
  Tags: new Array<string>(),
  Tasks: new Array<Lookup>(),
  TaskStatuses: new Array<Lookup>(),
  TemplateCategories: new Array<Lookup>(),
  TemplateStatus: new Array<TemplateStatus>(),
  TemplateTypes: new Array<TemplateType>(),
  UnitOfMeasures: new Array<UnitOfMeasure>(),
  UnsubscribeTypes: new Array<Lookup>(),
  UserRoles: new Array<Lookup>(),
  Websites: new Array<Lookup>(),
} as const;

export const allLookupsApiProperties = Object.keys(lookupsApiSample);

type LookupApiSampleType = typeof lookupsApiSample;
export interface LookupApiModel extends LookupApiSampleType {}

@Injectable({
  providedIn: 'root',
})
export class LookupsApiService extends RestClient {
  override url = 'types';

  getLookups(): Observable<LookupApiModel> {
    const uri = `${this.uri}/lookups`;
    return this.http.get<LookupApiModel>(uri);
  }
}
