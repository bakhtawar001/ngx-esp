import { ToastData } from '@cosmos/components/notification';
import { Contact } from '@esp/models';

export const TOAST_MESSAGES = {
  CONTACT_ACTIVATED: (): ToastData => ({
    title: 'Contact is active!',
    body: 'This record has been made active.',
    type: 'confirm',
  }),
  CONTACT_DEACTIVATED: (): ToastData => ({
    title: 'Contact is inactive!',
    body: 'This record has been deactivated.',
    type: 'confirm',
  }),
  CONTACT_CREATED: ({ FamilyName, GivenName }: Contact): ToastData => ({
    title: 'Contact created!',
    body: `Contact ${GivenName} ${FamilyName}  been created.`,
    type: 'confirm',
  }),
  CONTACT_NOT_CREATED: (): ToastData => ({
    title: 'Failure: Contact cannot be created!',
    body: 'Unable to create the contact.',
    type: 'error',
  }),
  CONTACT_DELETED: (name: string): ToastData => ({
    title: 'Success!',
    body: `${name} has been deleted.`,
    type: 'confirm',
  }),
  CONTACT_NOT_DELETED: (): ToastData => ({
    title: 'Error!',
    body: 'Contact cannot be deleted.',
    type: 'error',
  }),
  CONTACT_TRANSFERRED: (newOwner: string): ToastData => ({
    title: 'Ownership Transferred!',
    body: `Ownership has been transferred to ${newOwner}`,
    type: 'confirm',
  }),
  CONTACT_NOT_TRANSFERRED: (contactName: string): ToastData => ({
    title: 'Error: Ownership Not Transferred!',
    body: `Ownership of ${contactName} was unable to be transferred!`,
    type: 'error',
  }),
  CONTACT_NOT_UPDATED: (): ToastData => ({
    title: 'Error!',
    body: 'Data cannot be updated.',
    type: 'error',
  }),
};
