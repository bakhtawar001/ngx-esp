import {
  ModuleWithProviders,
  NgModule,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { AuthFacade } from '../../services';

@Pipe({
  name: 'hasRole',
})
export class HasRolePipe implements PipeTransform {
  constructor(private _authFacade: AuthFacade) {}

  transform(role: string): boolean {
    return this._authFacade.user.hasRole(role);
  }
}

@NgModule({
  declarations: [HasRolePipe],
  exports: [HasRolePipe],
})
export class HasRolePipeModule {
  static withProvide(): ModuleWithProviders<HasRolePipeModule> {
    return {
      ngModule: HasRolePipeModule,
      providers: [HasRolePipe],
    };
  }
}
