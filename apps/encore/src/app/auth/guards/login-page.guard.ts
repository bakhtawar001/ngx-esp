import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { CosmosConfigService } from '@cosmos/core';
import { AppConfig } from '../../core/types';

@Injectable({
  providedIn: 'root',
})
export class LoginPageGuard implements CanActivate {
  constructor(private _configService: CosmosConfigService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this._configService.patchConfig(<AppConfig>{
      layout: {
        navbar: {
          position: 'none',
        },
        toolbar: {
          position: 'none',
        },
        footer: {
          position: 'none',
        },
      },
    });

    return true;
  }
}
