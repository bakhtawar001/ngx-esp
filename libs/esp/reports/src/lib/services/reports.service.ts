import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ServiceConfig } from '@cosmos/common';
import { RestClient, HttpRequestOptions } from '@cosmos/common/http';

import { ASISERVICE_SERVICE_CONFIG } from '@esp/common';
import { ExportRequest, Report } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReportsService extends RestClient<Report> {
  url = `mediastats/reports`;
  pk = 'id';

  constructor(
    @Inject(ASISERVICE_SERVICE_CONFIG) protected config: ServiceConfig,
    protected http: HttpClient
  ) {
    super(config, http);
  }

  export(reportId: string, body: ExportRequest, options?: HttpRequestOptions) {
    return this.http.post<{ id: string }>(
      `${this.uri}/${reportId}/exports`,
      body,
      options
    );
  }

  exportStatus(
    reportId: string,
    exportId: string,
    options?: HttpRequestOptions
  ) {
    return this.http.get<{ status: string }>(
      `${this.uri}/${reportId}/exports/${exportId}`,
      options
    );
  }

  exportDownload(reportId: string, exportId: string) {
    return this.http.get<Blob>(`${this.uri}/${reportId}/exports/${exportId}`, {
      observe: 'response',
      responseType: 'blob' as 'json',
      params: {
        download: 'true',
      },
    });
  }

  getContacts(options?: HttpRequestOptions) {
    return this.http.get(`${this.prefix}/mediastats/contacts`, options);
  }
}
