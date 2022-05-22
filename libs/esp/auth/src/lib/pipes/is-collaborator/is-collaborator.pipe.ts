import {
  ModuleWithProviders,
  NgModule,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { AuthFacade } from '../../services';
import { AccessType, Collaborator } from '@esp/models';

@Pipe({
  name: 'isCollaborator',
})
export class IsCollaboratorPipe implements PipeTransform {
  constructor(private readonly authFacade: AuthFacade) {}

  transform(
    collaborators: Collaborator[] | undefined,
    accessType: AccessType
  ): boolean {
    const collaborator = (collaborators || []).find(
      (collaborator: Collaborator) =>
        collaborator.UserId === this.authFacade.user?.Id
    );

    if (!collaborator) {
      return false;
    }

    return collaborator.AccessType === accessType;
  }
}

@NgModule({
  declarations: [IsCollaboratorPipe],
  exports: [IsCollaboratorPipe],
})
export class IsCollaboratorPipeModule {
  static withProvide(): ModuleWithProviders<IsCollaboratorPipeModule> {
    return {
      ngModule: IsCollaboratorPipeModule,
      providers: [IsCollaboratorPipe],
    };
  }
}
