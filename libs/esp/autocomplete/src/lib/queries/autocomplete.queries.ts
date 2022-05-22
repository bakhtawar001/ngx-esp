import { createPropertySelectors } from '@cosmos/state';
import { AutocompleteState, AutocompleteStateModel } from '../states';

export namespace AutocompleteQueries {
  export const {
    parties: getParties,
    users: getUsers,
    usersAndTeams: getUsersAndTeams,
  } = createPropertySelectors<AutocompleteStateModel>(AutocompleteState);
}
