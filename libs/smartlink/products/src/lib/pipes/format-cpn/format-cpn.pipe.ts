import { NgModule, Pipe, PipeTransform } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthFacade } from '@esp/auth';

@Pipe({
  name: 'formatCPN',
})
export class FormatCPNPipe implements PipeTransform {
  constructor(private _authFacade: AuthFacade) {}

  transform(id: number = 0): string {
    let ret = '';

    if (this._authFacade.user?.CompanyId && id && id > 0) {
      ret = 'CPN-' + (id + this._authFacade.user?.CompanyId).toString();
    }

    return ret;
  }
}

@NgModule({
  declarations: [FormatCPNPipe],
  exports: [FormatCPNPipe],
})
export class FormatCPNPipeModule {}
