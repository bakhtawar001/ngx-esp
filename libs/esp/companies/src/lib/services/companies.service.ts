import { Injectable } from '@angular/core';
import { PartiesService } from '@esp/parties';

import { Company, CompanySearch, SearchResult } from '@esp/models';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService extends PartiesService<Company> {
  override url = `companies`;

  setStatus(id: number, active: boolean) {
    return this.http.put(`${this.uri}/bulk/status`, [id], {
      params: { args: active.toString() },
    });
  }

  searchRecent(parameters = {}): Observable<SearchResult<CompanySearch>> {
    let params = new HttpParams();
    const keys = <Array<keyof typeof parameters>>Object.keys(parameters);

    keys.forEach((key) => {
      if (typeof parameters[key] !== 'undefined') {
        params = params.append(
          key,
          typeof parameters[key] === 'object'
            ? JSON.stringify(parameters[key])
            : parameters[key]
        );
      }
    });

    return this.http.get<SearchResult<CompanySearch>>(
      `${this.uri}/searchrecent`,
      { params }
    );
  }
}
