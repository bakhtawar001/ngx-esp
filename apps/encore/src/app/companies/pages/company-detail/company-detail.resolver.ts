import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { getParamsObject } from '@cosmos/core';
import { CompaniesActions } from '@esp/companies';
import { Store } from '@ngxs/store';

type CompanyDetailParams = {
  companyId: number;
};

@Injectable()
export class CompanyDetailResolver implements Resolve<void> {
  constructor(private readonly store: Store) {}

  resolve(route: ActivatedRouteSnapshot): void {
    const params = this.getParams(route);

    if (!params) {
      return;
    }

    this.store.dispatch(new CompaniesActions.Get(params.companyId));
  }

  private getParams(
    route: ActivatedRouteSnapshot
  ): CompanyDetailParams | undefined {
    const params = getParamsObject(route.paramMap, ['id']);

    if (!params) {
      return;
    }

    return {
      companyId: parseInt(params.id, 10),
    };
  }
}
