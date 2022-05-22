import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import { ESP_SERVICE_CONFIG } from '@esp/service-configs';
import { Address } from '@esp/models';
import { Observable } from 'rxjs';
import {
  CurrencyConversion,
  CurrencyPreferences,
  Lookup,
  OrderEmailTemplate,
  Setting,
  TenantOrderNumber,
} from '../models';
import { DefaultTaskSetting } from '../models/default-task-setting';
import { NotificationSetting } from '../models/notiication-setting';
import { OrderStatusType } from '../models/order-status-type';
import { SettingCode } from '../models/setting-code';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private url = 'settings';

  private get uri() {
    return `${this.config.Url}/${this.url}`;
  }

  constructor(
    @Inject(ESP_SERVICE_CONFIG) protected config: ServiceConfig,
    private http: HttpClient
  ) {}

  public settings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(this.uri);
  }

  public updateSetting(
    code: SettingCode,
    setting: Setting
  ): Observable<Setting> {
    return this.http.put<Setting>(`${this.uri}/${code}`, setting);
  }

  public thirdPartyOptions(): Observable<Lookup[]> {
    return this.http.get<Lookup[]>(`${this.uri}/thirdpartyoptions`);
  }

  public capabilities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.uri}/capabilities`);
  }

  public capability(name, type, companyId?): Observable<boolean> {
    let url = `${this.uri}/capabilities/${name}/${type}`;

    if (companyId) {
      url += `/${companyId}`;
    }

    return this.http.get<boolean>(url);
  }

  public orderNumber(): Observable<TenantOrderNumber> {
    return this.http.get<TenantOrderNumber>(`${this.uri}/ordernumber`);
  }

  public updateOrderNumber(
    params: TenantOrderNumber
  ): Observable<TenantOrderNumber> {
    return this.http.put<TenantOrderNumber>(`${this.uri}/ordernumber`, params);
  }

  public currencyPreferences(): Observable<CurrencyPreferences> {
    return this.http.get<CurrencyPreferences>(
      `${this.uri}/currencypreferences`
    );
  }

  public currencyConversionRate(
    sourceCode: string,
    targetCode: string
  ): Observable<CurrencyConversion> {
    return this.http.get<CurrencyConversion>(
      `${this.uri}/currency/${sourceCode}/conversionto/${targetCode}`
    );
  }

  public updateCurrencyConversionRate(
    sourceCode: string,
    targetCode: string,
    conversion: CurrencyConversion
  ): Observable<CurrencyConversion> {
    return this.http.put<CurrencyConversion>(
      `${this.uri}/currency/${sourceCode}/conversionto/${targetCode}`,
      conversion
    );
  }

  public orderStatusType(): Observable<OrderStatusType> {
    return this.http.get<OrderStatusType>(`${this.uri}/orderstatustype`);
  }

  public createOrderStatusTypes(
    params: OrderStatusType
  ): Observable<OrderStatusType> {
    return this.http.post<OrderStatusType>(
      `${this.uri}/orderstatustype`,
      params
    );
  }

  public updateOrderStatusType(
    id: number,
    params: OrderStatusType
  ): Observable<OrderStatusType> {
    return this.http.put<OrderStatusType>(
      `${this.uri}/orderstatustype/${id}`,
      params
    );
  }

  public deleteOrderStatusType(id: number) {
    return this.http.delete(`${this.uri}/orderstatustype/${id}`);
  }

  public notifications(): Observable<NotificationSetting[]> {
    return this.http.get<NotificationSetting[]>(`${this.uri}/notifications`);
  }

  public updateNotifications(
    params: NotificationSetting[]
  ): Observable<NotificationSetting[]> {
    return this.http.post<NotificationSetting[]>(
      `${this.uri}/notifications`,
      params
    );
  }

  public tax(): Observable<Address> {
    return this.http.get<Address>(`${this.uri}/tax`);
  }

  public addresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.uri}/addresses`);
  }

  public address(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.uri}/addresses/${id}`);
  }

  public updateAddresses(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.uri}/addresses/${id}`, address);
  }

  public createAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.uri}/addresses`, address);
  }

  public deleteAddress(id: number) {
    return this.http.delete(`${this.uri}/addresses/${id}`);
  }

  public postMessage(message: string, subject?: string, body?: string) {
    if ((subject && !body) || (!subject && body)) {
      throw new Error('Subject + Body are required when one is provided');
    }

    let uri = `${this.uri}/notification`;

    if (!subject) {
      uri += `/bus?message=${message}`;
    } else {
      uri += `?message=${message}&subject=${subject}&body=${body}`;
    }

    return this.http.post(uri, {});
  }

  public getAppCache(key: string, name: string) {
    return this.http.get(`${this.uri}/appcache/${key}/${name}`);
  }

  public getCache(key: string, name: string) {
    return this.http.get(`${this.uri}/cache/${key}/${name}`);
  }

  public taskSetting(id: number) {
    return this.http.get(`${this.uri}/settings/tasks/${id}`);
  }

  public tasksSettings() {
    return this.http.get(`${this.uri}/settings/tasks`);
  }

  public manualTaskSettings() {
    return this.http.get(`${this.uri}/settings/tasks/manual`);
  }

  public createTasksSettings(task: DefaultTaskSetting) {
    return this.http.post(`${this.uri}/settings/tasks`, task);
  }

  public deleteTaskSetting(id: number) {
    return this.http.delete(`${this.uri}/tasks/${id}`);
  }

  public validationList() {
    return this.http.get(`${this.uri}/settings/validation/list`);
  }

  public customValidations() {
    return this.http.get(`${this.uri}/settings/validation/custom`);
  }

  public createValidation(key: string, isRequired: boolean, orderType: string) {
    return this.http.post(
      `${this.uri}/settings/validation/${key}/${isRequired}/${orderType}`,
      {}
    );
  }

  public deleteValidation(key: string, orderType: string) {
    return this.http.delete(
      `${this.uri}/settings/validation/${key}/${orderType}`
    );
  }

  public setupAiaValidation() {
    return this.http.post(`${this.uri}/validation/setup/aia`, {});
  }

  public setupTailorValidation() {
    return this.http.post(`${this.uri}/validation/setup/tailor`, {});
  }

  public clearValidation() {
    return this.http.post(`${this.uri}/validation/clear`, {});
  }

  public editCustomValidation(type: string, orderType: string) {
    return this.http.post(
      `${this.uri}/validation/custom/${type}/${orderType}`,
      {}
    );
  }

  public deleteCustomValidation(type: string, orderType: string) {
    return this.http.delete(
      `${this.uri}/validation/custom/${type}/${orderType}`
    );
  }

  public orderEmailTemplate() {
    return this.http.get(`${this.uri}/orderemailtemplate`);
  }

  public addEmailTemplate(params: OrderEmailTemplate) {
    return this.http.post(`${this.uri}/orderemailtemplate`, params);
  }

  public getEmailTemplate(type: string) {
    return this.http.get(`${this.uri}/orderemailtemplate/default/${type}`);
  }

  public orderEmailMergedFields() {
    return this.http.get(`${this.uri}/orderemailmergedfields`);
  }

  public updateParentTenantAuth(value: string) {
    return this.http.post(`${this.uri}/parenttenantauth/${value}`, {});
  }

  public parentTenantAuth() {
    return this.http.get(`${this.uri}/parenttenantauth`);
  }

  public addWhitelabelSettings(option: string) {
    return this.http.get(`${this.uri}/whitelabel/${option}`);
  }

  public whitelabelSettings() {
    return this.http.get(`${this.uri}/whitelabel`);
  }

  public getTenantNames() {
    return this.http.post(`${this.uri}/tenantnames/aia`, {});
  }

  public addCreditStatus(option: string) {
    return this.http.post(`${this.uri}/creditstatuses?option=${option}`, {});
  }

  public addSuperuserRole() {
    return this.http.post(`${this.uri}/superuserrole`, {});
  }

  public deleteSuperuserRole() {
    return this.http.delete(`${this.uri}/superuserrole`);
  }

  public isAia() {
    return this.http.get(`${this.uri}/tenant/isAia`);
  }

  public isLapine() {
    return this.http.get(`${this.uri}/tenant/isLapine`);
  }

  public createTailorApp() {
    return this.http.post(`${this.uri}/Tailor/createApp`, {});
  }

  public enableTailorLapine() {
    return this.http.post(`${this.uri}/Tailor/enable/lapine`, {});
  }

  public enableTailor() {
    return this.http.post(`${this.uri}/Tailor/enable/test`, {});
  }

  public enableTailorOrder() {
    return this.http.post(`${this.uri}/Tailer/enable/test/order`, {});
  }

  public enableTailorLineItem() {
    return this.http.post(`${this.uri}/Tailor/enable/test/lineitem`, {});
  }

  public enableTailorProductVariantLineItem() {
    return this.http.post(
      `${this.uri}/Tailor/enable/test/productvariantlineitem`,
      {}
    );
  }

  public deleteTailorModel(model: string) {
    return this.http.delete(`${this.uri}/Tailor/enable/test/${model}`);
  }

  public disableTailor() {
    return this.http.post(`${this.uri}/Tailor/disable`, {});
  }
}
