import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@cosmos/forms';
import {
  AccessPermission,
  AccessType,
  Collaborator,
  Shareable,
} from '@esp/models';
import { CollaboratorFormModel } from './models';
import { sortBy } from 'lodash-es';

export interface UserItem extends Collaborator {
  Roles: { Code: string }[];
  IconMediaLink: { FileUrl: string };
}

@Injectable()
export class AsiManageCollaboratorsPresenter {
  readonly allowEditingForm = new FormControl<boolean>(true);
  readonly collaboratorForm = this.createCollaboratorForm();
  readonly newCollaboratorForm = new FormControl<UserItem>();

  constructor(private readonly _fb: FormBuilder) {}

  addNewCollaborator(userOrTeam: UserItem, onlyReadWrite: boolean): void {
    const collaborators = this.collaboratorForm.controls
      .Collaborators as FormControl<Collaborator[]>;
    const permissions = this.collaboratorForm.controls.Access as FormControl<
      AccessPermission[]
    >;

    const collaborator = {
      IsTeam: userOrTeam.IsTeam,
      Name: userOrTeam.Name,
      Role: userOrTeam.IsTeam
        ? 'Team'
        : userOrTeam.Roles?.find((role) => role.Code === 'Administrator')
        ? 'Administrator'
        : 'User',
      UserId: userOrTeam.Id,
      Id: userOrTeam.Id,
      ImageUrl: userOrTeam.IconMediaLink?.FileUrl,
    } as Collaborator;

    const permission = {
      AccessLevel: userOrTeam.IsTeam ? 'Team' : 'User',
      EntityId: userOrTeam.Id,
      AccessType: onlyReadWrite ? 'ReadWrite' : 'Read',
    } as AccessPermission;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const access = [...permissions.value, permission];

    this.collaboratorForm.patchValue({
      Collaborators: this.setCollaboratorsWithAccess(
        this.addCollaboratorNextToOwner(collaborators.value, collaborator),
        access
      ),
      Access: access,
    });

    permissions.markAsDirty();

    this.newCollaboratorForm.reset(null);
  }

  initAllowEditingForm(entity: Shareable): void {
    if (entity?.AccessLevel !== 'Everyone' || !entity?.Access) {
      return;
    }

    // @TODO possible place to improvement after making Company (CRM) returning Access field
    this.allowEditingForm.setValue(
      entity?.Access?.[0]?.AccessType === 'ReadWrite'
    );
  }

  initCollaboratorForm(entity: Shareable): void {
    const access = entity.Access ?? [];
    const [owner, ...collaborators] = entity.Collaborators ?? [];

    this.collaboratorForm.patchValue({
      Access: access,
      AccessLevel: entity.AccessLevel,
      Collaborators: this.setCollaboratorsWithAccess(
        [
          owner,
          ...sortBy(collaborators, [
            (collaborator) => collaborator.Name.toLocaleUpperCase(),
          ]),
        ],
        access
      ),
    });
  }

  mapAccessList(form: CollaboratorFormModel): AccessPermission[] {
    if (form.AccessLevel === 'Owner') {
      return [];
    } else if (form.AccessLevel === 'Everyone') {
      return [
        {
          AccessLevel: 'Everyone',
          EntityId: 0,
          AccessType: this.allowEditingForm.value ? 'ReadWrite' : 'Read',
        },
      ];
    }

    return form.Access as AccessPermission[];
  }

  mapCollaborators(form: CollaboratorFormModel): Collaborator[] {
    if (form.AccessLevel === 'Owner' || form.AccessLevel === 'Everyone') {
      return (form.Collaborators as Collaborator[]).filter(
        (collaborator) => collaborator.Role === 'Owner'
      );
    }

    return form.Collaborators as Collaborator[];
  }

  refreshExcludeList(entity: Shareable): string {
    const excludeList = [entity.OwnerId].concat(
      this.collaboratorForm.controls.Access?.value?.map((a) => a.EntityId)
    );

    return excludeList.join(',');
  }

  removeCollaborator(collaborator: Collaborator) {
    const collaborators = this.collaboratorForm.controls
      .Collaborators as FormControl<Collaborator[]>;
    const access = this.collaboratorForm.controls.Access as FormControl<
      AccessPermission[]
    >;

    collaborators.setValue(
      collaborators.value?.filter(
        (c) => c.UserId !== collaborator.UserId || c.Id !== collaborator.Id
      )
    );
    access.setValue(
      access.value?.filter(
        (a) => a.EntityId !== (collaborator.UserId ?? collaborator.Id)
      )
    );

    this.collaboratorForm.markAsDirty();
  }

  setAccessType(
    accessType: AccessType,
    collaborator: Collaborator,
    index: number
  ): void {
    const accessControl = this.collaboratorForm.controls.Access as FormControl<
      AccessPermission[]
    >;
    const access = [
      ...accessControl.value.filter(
        (access) => access.AccessLevel !== 'Everyone'
      ),
    ];

    const accessObjectIndex = access.findIndex(
      (val) =>
        val.EntityId === collaborator.Id || val.EntityId === collaborator.UserId
    );

    if (accessObjectIndex > -1) {
      const [object] = access.splice(accessObjectIndex, 1);

      const newObject = { ...object };

      newObject.AccessType = accessType;

      access.push(newObject);
    } else {
      access.push({
        AccessLevel: collaborator.IsTeam ? 'Team' : 'User',
        EntityId: collaborator.Id,
        AccessType: accessType,
      });
    }

    const collaboratorsControl = this.collaboratorForm.controls
      .Collaborators as FormControl<Collaborator[]>;
    const collaborators = [...collaboratorsControl.value];
    const newCollaborator = { ...collaborators[index] };
    newCollaborator.AccessType = accessType;

    collaborators.splice(index, 1, newCollaborator);

    collaboratorsControl.setValue(
      this.setCollaboratorsWithAccess(collaborators, access)
    );
    accessControl.setValue(access);

    this.collaboratorForm.markAsDirty();
  }

  private addCollaboratorNextToOwner(
    collaboratorList: Collaborator[],
    collaborator: Collaborator
  ): Collaborator[] {
    const result = [...collaboratorList];
    result.splice(1, 0, collaborator);
    return result;
  }

  private createCollaboratorForm(): FormGroup<CollaboratorFormModel> {
    return this._fb.group<CollaboratorFormModel>({
      AccessLevel: ['Owner'],
      Access: [[]],
      Collaborators: [[]],
    });
  }

  private setCollaboratorsWithAccess(
    collaborators: Collaborator[],
    access: AccessPermission[]
  ): Collaborator[] {
    return collaborators.map((c) => {
      const collaborator = { ...c };

      const collaboratorAccess = access.find(
        (a) => a.EntityId === (c.UserId || c.TeamId || c.Id)
      );

      if (collaboratorAccess) {
        // @TODO possible place to improvement after making Company (CRM) returning Access field
        collaborator.AccessType = collaboratorAccess.AccessType || 'ReadWrite';
      }

      return collaborator;
    });
  }
}
