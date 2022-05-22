import {
  ModuleWithProviders,
  NgModule,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Collaborator } from '@esp/models';
import { HasRolePipe, HasRolePipeModule } from '../has-role';
import {
  IsCollaboratorPipe,
  IsCollaboratorPipeModule,
} from '../is-collaborator';
import { IsOwnerPipe, IsOwnerPipeModule } from '../is-owner';

@Pipe({
  name: 'hasWriteAccess',
})
export class HasWriteAccessPipe implements PipeTransform {
  constructor(
    private readonly hasRolePipe: HasRolePipe,
    private readonly isCollaboratorPipe: IsCollaboratorPipe,
    private readonly isOwnerPipe: IsOwnerPipe
  ) {}

  transform(collaborators: Collaborator[] | undefined, ownerId): boolean {
    return (
      this.hasRolePipe.transform('Administrator') ||
      this.isCollaboratorPipe.transform(collaborators, 'ReadWrite') ||
      this.isOwnerPipe.transform(ownerId)
    );
  }
}

@NgModule({
  imports: [
    HasRolePipeModule.withProvide(),
    IsCollaboratorPipeModule.withProvide(),
    IsOwnerPipeModule.withProvide(),
  ],
  declarations: [HasWriteAccessPipe],
  exports: [HasWriteAccessPipe],
})
export class HasWriteAccessPipeModule {
  static withProvide(): ModuleWithProviders<HasWriteAccessPipeModule> {
    return {
      ngModule: HasWriteAccessPipeModule,
      providers: [HasWriteAccessPipe],
    };
  }
}
