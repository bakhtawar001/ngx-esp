import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import { VULCAN_SERVICE_CONFIG } from '@esp/service-configs';
import { RestClient } from '@esp/common/http';
import { Project, SearchResult } from '@esp/models';
import { Observable } from 'rxjs';
import {
  ProjectClosePayload,
  ProjectSearch,
  ResponseAggregations,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProjectsApiService extends RestClient<Project> {
  override url = 'projects';

  constructor(
    @Inject(VULCAN_SERVICE_CONFIG) protected override config: ServiceConfig,
    protected override http: HttpClient
  ) {
    super(config, http);

    this.searchMethod = 'POST';
  }

  searchRecent(
    parameters = {}
  ): Observable<SearchResult<ProjectSearch, ResponseAggregations>> {
    let params = {};
    const keys = <Array<keyof typeof parameters>>Object.keys(parameters);

    keys.forEach((key) => {
      if (typeof parameters[key] !== 'undefined') {
        params = {
          ...params,
          [key]:
            typeof parameters[key] === 'object'
              ? JSON.stringify(parameters[key])
              : parameters[key],
        };
      }
    });

    return this.http.post<SearchResult<ProjectSearch, ResponseAggregations>>(
      `${this.uri}/searchrecent`,
      { ...params }
    );
  }

  closeProject(payload: ProjectClosePayload): Observable<void> {
    return this.http.put<void>(`${this.uri}/${payload.Project.Id}/deactivate`, {
      Note: payload.Note,
      Resolution: payload.Resolution,
    });
  }

  reopenProject(id: number): Observable<void> {
    return this.http.put<void>(`${this.uri}/${id}/activate`, {});
  }

  transferOwner(id: number, ownerId: number): Observable<Project> {
    return this.http.put<Project>(`${this.uri}/${id}/newowner/${ownerId}`, {});
  }
}
