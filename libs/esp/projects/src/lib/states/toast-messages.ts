import { ToastData } from '@cosmos/components/notification';
import { BaseProject } from '@esp/models';

export const TOAST_MESSAGES = {
  COMPANY_NOT_CREATED: (): ToastData => ({
    title: `Failure: Company not created!`,
    body: `Unable to create the company.`,
    type: 'error',
  }),
  COMPANY_CREATED: (companyName: string): ToastData => ({
    title: 'Success: Company created!',
    body: `${companyName} has been created.`,
    type: 'confirm',
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
  PROJECT_CREATED: (projectName: string, companyName: string): ToastData => ({
    title: 'Project created successfully',
    body: `The ${projectName} project has been created for ${companyName}.`,
    type: 'confirm',
  }),
  PROJECT_NOT_CREATED: (): ToastData => ({
    title: 'Failure: Project cannot be created!',
    body: `Unable to create the project.`,
    type: 'error',
  }),
  PROJECT_FOR_COMPANY_UPDATED: (
    projectName: string,
    companyName: string
  ): ToastData => ({
    title: 'Project updated successfully',
    body: `The ${projectName} project has been updated for ${companyName}.`,
    type: 'confirm',
  }),
  PROJECT_UPDATED: (projectName: string): ToastData => ({
    title: 'Project updated successfully',
    body: `The ${projectName} project has been updated.`,
    type: 'confirm',
  }),
  PROJECT_NOT_UPDATED: (): ToastData => ({
    title: 'Project cannot be updated',
    body: 'Unable to update the project.',
    type: 'error',
  }),
  PROJECT_TRANSFERRED: (project: BaseProject): ToastData => {
    const owner = project.Collaborators.find((user) => {
      return user.Id === project.OwnerId;
    });

    return {
      title: 'Ownership Transferred!',
      body: `Ownership has been transferred to ${owner?.Name}`,
      type: 'confirm',
    };
  },
  PROJECT_NOT_TRANSFERRED: (project: BaseProject): ToastData => ({
    title: 'Error: Ownership Not Transferred!',
    body: `Ownership of ${project.Name} was unable to be transferred!`,
    type: 'error',
  }),
  PROJECT_CLOSED: (project: BaseProject): ToastData => ({
    title: `Project ${project.Name} is Closed!`,
    body: `${project.Name} has been closed.`,
    type: 'confirm',
  }),
  PROJECT_NOT_CLOSED: (project: BaseProject): ToastData => ({
    title: `Project ${project.Name} cannot be updated to Closed!`,
    body: `${project.Name} cannot be closed.`,
    type: 'error',
  }),
  PROJECT_REOPENED: (project: BaseProject): ToastData => ({
    title: `Project ${project.Name} is Reopened!`,
    body: `${project.Name} has been reopened.`,
    type: 'confirm',
  }),
  PROJECT_NOT_REOPENED: (project: BaseProject): ToastData => ({
    title: `Project ${project.Name} cannot be updated to Reopened!`,
    body: `${project.Name} cannot be reopened.`,
    type: 'error',
  }),
} as const;
