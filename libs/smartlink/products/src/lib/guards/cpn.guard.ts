import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { getParamsObject } from '@cosmos/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthFacade } from '@esp/auth';

const CPN_REGEXP = new RegExp(/CPN[\s-]?(\d+)$/i);

@Injectable({ providedIn: 'root' })
export class CPNGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly _authFacade: AuthFacade
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const { productId = 0, q: keywords } = this.getParams(route) || {};

    const hasProductId = productId ?? 0 > 0;

    if (hasProductId) {
      return this.router.createUrlTree(['/products', productId], {
        queryParams: {
          keywords,
        },
      });
    }

    return true;
  }

  private getParams(route: ActivatedRouteSnapshot) {
    const params = getParamsObject(route.queryParamMap, { optional: ['q'] });

    return (
      params && {
        q: params.q,
        productId: parseProductIdFromCPN(
          params.q,
          this._authFacade.user?.CompanyId
        ),
      }
    );
  }
}

function parseProductIdFromCPN(
  term: string | undefined,
  companyId: number | undefined
) {
  const matches = term?.match(CPN_REGEXP);
  return matches && typeof companyId === 'number' && +matches[1] - companyId;
}
