import { ToastData } from '@cosmos/components/notification';

export const TOAST_MESSAGES = {
  COMPANY_NOT_SAVED: (): ToastData => ({
    title: `Error!`,
    body: `Data cannot be saved`,
    type: 'error',
  }),

  CREATE_COMPANY_SUCCESS: (companyName: string): ToastData => ({
    title: 'Success: Company created!',
    body: `${companyName} has been created.`,
    type: 'confirm',
  }),

  CREATE_COMPANY_FAIL: (): ToastData => ({
    title: 'Error: Company not created!',
    body: 'Your company was not able to be created.',
    type: 'error',
  }),
  CONTACT_NOT_CREATED: (): ToastData => ({
    title: `Failure: Contact cannot be created!`,
    body: `Unable to create the contact.`,
    type: 'error',
  }),
  CONTACT_CREATED: (name: string): ToastData => ({
    title: 'Success: Contact created!',
    body: `${name} has been created.`,
    type: 'confirm',
  }),
  CONTACT_LINK_CREATED: (name: string): ToastData => ({
    title: 'Success: Contact link created!',
    body: `Contact link to ${name} has been created.!`,
    type: 'confirm',
  }),
  CONTACT_LINK_NOT_CREATED: (): ToastData => ({
    title: 'Failure: Contact link cannot be created!',
    body: `Unable to create the contact link.`,
    type: 'error',
  }),
  CONTACT_LINK_UPDATED: (name: string): ToastData => ({
    title: 'Success: Contact link updated!',
    body: `Contact link to ${name} has been updated.!`,
    type: 'confirm',
  }),
  CONTACT_LINK_NOT_UPDATED: (): ToastData => ({
    title: 'Failure: Contact link cannot be updated!',
    body: `Unable to update the contact link.`,
    type: 'error',
  }),
  CONTACT_LINK_REMOVED: (): ToastData => ({
    title: 'Success: Contact link removed!',
    body: `Contact link has been removed.!`,
    type: 'confirm',
  }),
  CONTACT_LINK_NOT_REMOVED: (): ToastData => ({
    title: 'Failure: Contact link cannot be removed!',
    body: `Unable to remove the contact link.`,
    type: 'error',
  }),
  DELETE_COMPANY_SUCCESS: (name: string): ToastData => ({
    title: 'Success: Company deleted!',
    body: `Company ${name} has been deleted!`,
    type: 'confirm',
  }),
  DELETE_COMPANY_FAIL: (isDeletable: boolean): ToastData => ({
    title: 'Failure: Company not deleted!',
    body: isDeletable
      ? `Your company was unable to delete!`
      : `This company contains one or more projects, presentations, or orders and cannot be deleted!`,
    type: 'error',
  }),
  OWNERSHIP_TRANSFERRED: (name: string): ToastData => ({
    title: 'Success: Ownership Transferred!',
    body: `Ownership has been transferred to ${name}.`,
    type: 'confirm',
  }),
  OWNERSHIP_NOT_TRANSFERRED: (name: string): ToastData => ({
    title: 'Failure: Ownership Not Transferred!',
    body: `Ownership of ${name} was unable to be transferred!`,
    type: 'error',
  }),
  TOGGLE_COMPANY_STATUS_SUCCESS: (isActive: boolean): ToastData => ({
    title: `Company is ${isActive ? 'active' : 'inactive'}!`,
    body: `This record has been ${isActive ? 'made active' : 'deactivated'}.`,
    type: 'info',
  }),
  TOGGLE_COMPANY_STATUS_FAIL: (isActive: boolean): ToastData => ({
    title: 'Error!',
    body: `This record was not ${
      isActive ? 'made active' : 'deactivated'
    } due to an error.`,
    type: 'error',
  }),
};
