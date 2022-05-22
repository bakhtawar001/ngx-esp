import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ServiceConfig } from '@cosmos/common';
import { HttpRequestOptions } from '../types';

@Injectable()
export class RestClient<T = any> {
  protected pk = 'Id';

  public prefix = this.config.Url;
  public url = '';

  /**
   * Constructor
   *
   * @param {ServiceConfig} config
   * @param {HttpClient} http
   */
  constructor(protected config: ServiceConfig, protected http: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  get uri(): string {
    const prefix = this.prefix ? this.prefix : '';

    return `${prefix}/${this.url}`;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  all(options?: HttpRequestOptions): Observable<T[]> {
    return this.http.get<T[]>(this.uri, options);
  }

  create<T>(model: T, options?: HttpRequestOptions): Observable<T> {
    return this.http.post<T>(`${this.uri}`, model, options);
  }

  delete(id: number | string, options?: HttpRequestOptions) {
    return this.http.delete<T>(`${this.uri}/${id}`, options);
  }

  get(id: number | string, options?: HttpRequestOptions): Observable<T> {
    return this.http.get<T>(`${this.uri}/${id}`, options);
  }

  save<T>(model: T, options?: HttpRequestOptions): Observable<T> {
    return (model as any)[this.pk]
      ? this.update(model, options)
      : this.create(model, options);
  }

  update<T>(model: T, options?: HttpRequestOptions): Observable<T> {
    return this.http.put<T>(
      `${this.uri}/${(model as any)[this.pk]}`,
      model,
      options
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  protected getParams(options?: HttpRequestOptions): HttpParams | undefined {
    let params: HttpParams | undefined;

    if (options?.params) {
      if (options.params instanceof HttpParams) {
        params = options.params;
      } else {
        params = new HttpParams({
          fromObject: options.params,
        });
      }
    }

    return params;
  }
}
