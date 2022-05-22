import { BaseProject } from '@esp/models';

export interface ProjectClosePayload {
  Project: BaseProject;
  Note: string;
  Resolution: string;
}
