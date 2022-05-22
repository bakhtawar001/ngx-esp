import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import { HttpRequestOptions } from '@cosmos/common/http';
import { ESP_SERVICE_CONFIG } from '@esp/service-configs';
import { Observable } from 'rxjs';
import { DocumentSetting } from '../models/document-setting';

@Injectable({
  providedIn: 'root',
})
export class DesignSettingsService {
  private url = 'settings/design';

  private get uri() {
    return `${this.config.Url}/${this.url}`;
  }

  constructor(
    @Inject(ESP_SERVICE_CONFIG) protected config: ServiceConfig,
    private http: HttpClient
  ) {}

  get(): Observable<DocumentSetting> {
    return this.http.get<DocumentSetting>(this.uri);
  }

  save(model: DocumentSetting, options?: HttpRequestOptions) {
    return this.update(model, options);
  }

  update(model: DocumentSetting, options?: HttpRequestOptions) {
    return this.http.put<DocumentSetting>(this.uri, model, options);
  }
}
