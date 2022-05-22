import {
  ModuleWithProviders,
  NgModule,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { AuthFacade } from '../../services';

@Pipe({
  name: 'isOwner',
})
export class IsOwnerPipe implements PipeTransform {
  constructor(private readonly authFacade: AuthFacade) {}

  transform(entityOwnerId: number): boolean {
    return this.authFacade.user?.Id === entityOwnerId;
  }
}

@NgModule({
  declarations: [IsOwnerPipe],
  exports: [IsOwnerPipe],
})
export class IsOwnerPipeModule {
  static withProvide(): ModuleWithProviders<IsOwnerPipeModule> {
    return {
      ngModule: IsOwnerPipeModule,
      providers: [IsOwnerPipe],
    };
  }
}
