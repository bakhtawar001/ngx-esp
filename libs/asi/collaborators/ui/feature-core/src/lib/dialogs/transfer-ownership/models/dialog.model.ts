import { User, UserTeam } from '@esp/autocomplete';
import { Entity, Shareable } from '@esp/models';

export interface TransferOwnershipDialogData {
  entity: Shareable & Entity;
  // The transfer ownership currently can behave as follows:
  // 1) can close immediately and transferring ownership acts as `fire & forget` (means the user
  // is unaware what's happening behing the scenes since there's no UI activity). This is legacy.
  // 2) can disable the `Transfer` button and wait until the ownership is transferred
  // The second flow has better user experience since the UI is blocked and the user knows
  // that something is actually happening.
  // We should refactor all transfer ownership dialogs to behave in that way and remove that property.
  shouldBlockUntilTheOwnerIsTransferred?: boolean;
}

export type TransferOwnershipDialogResult = User | UserTeam;
