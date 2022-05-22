import { ToastData } from '@cosmos/components/notification';

export const TOAST_MESSAGES = {
  CONTACT_CANNOT_BE_DELETED: (): ToastData => ({
    title: 'Error!',
    body: 'This contact can not be deleted because they are designated as a user.',
    type: 'error',
  }),
};
