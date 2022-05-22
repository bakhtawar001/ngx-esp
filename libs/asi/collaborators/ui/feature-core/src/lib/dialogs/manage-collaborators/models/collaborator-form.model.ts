import { Shareable } from '@esp/models';

export type CollaboratorFormModel = Pick<
  Shareable,
  'Access' | 'AccessLevel' | 'Collaborators'
>;
