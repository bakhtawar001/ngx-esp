import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { getParamsObject } from '@cosmos/core';
import { SearchCriteria } from '@esp/models';
import { ProjectSearchActions } from '@esp/projects';
import { Store } from '@ngxs/store';

type CompanyProjectsParams = {
  companyId: number;
};

@Injectable()
export class CompanyProjectsResolver implements Resolve<void> {
  constructor(private readonly store: Store) {}

  resolve(route: ActivatedRouteSnapshot): void {
    const params = this.getParams(route);

    if (!params) {
      return;
    }

    this.store.dispatch(
      new ProjectSearchActions.PrepareCriteria(
        new SearchCriteria({
          filters: {},
          term: '',
          from: 1,
          id: params.companyId,
        })
      )
    );
  }

  private getParams(
    route: ActivatedRouteSnapshot
  ): CompanyProjectsParams | undefined {
    const params = getParamsObject(route.parent.parent.paramMap, ['id']);

    if (!params) {
      return;
    }

    return {
      companyId: parseInt(params.id, 10),
    };
  }
}
