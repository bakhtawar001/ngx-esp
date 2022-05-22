import { Shareable } from '@esp/models';

import { CollaboratorFormModel } from './collaborator-form.model';

export interface ManageCollaboratorsDialogData {
  entity: Shareable;
  isOnlyReadWrite: boolean; // @TODO might be removed in the future
}

export type ManageCollaboratorsDialogResult = CollaboratorFormModel;
