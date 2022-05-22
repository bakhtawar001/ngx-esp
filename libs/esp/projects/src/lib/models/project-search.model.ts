import { BaseProject, ProjectStepName } from '@esp/models';

export interface ProjectSearch extends BaseProject {
  StepName?: ProjectStepName;
  Step?: number;
  UpdateDate?: Date;
}
