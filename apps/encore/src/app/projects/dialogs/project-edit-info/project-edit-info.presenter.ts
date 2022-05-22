import { Injectable } from '@angular/core';
import { Project } from '@esp/models';
import { ProjectDetailsForm } from '@esp/projects';

@Injectable()
export class ProjectEditInfoPresenter {
  parseToForm(project: Project): ProjectDetailsForm {
    return {
      ...project,
      Type: project.Type,
      Budget: project.Budget ? `${project.Budget}` : '',
      NumberOfAssignees: project.NumberOfAssignees
        ? `${project.NumberOfAssignees}`
        : '',
      IsInHandsDateFlexible: project.IsInHandsDateFlexible,
    };
  }

  parseToProject(form: ProjectDetailsForm, project: Project): Project {
    const result = { ...form };
    const budget = form.Budget
      ? parseFloat(this.removeGroupSeparators(form.Budget))
      : null;

    const attendees = form.NumberOfAssignees
      ? parseInt(this.removeGroupSeparators(form.NumberOfAssignees), 10)
      : null;

    Object.keys(form).forEach((key) => {
      if (form[key] === '') {
        result[key] = null;
      }
    });

    return {
      ...result,
      Id: project.Id,
      Customer: project.Customer,
      CreateDate: project.CreateDate,
      Budget: budget,
      NumberOfAssignees: attendees,
      IsEditable: project.IsEditable,
    };
  }

  private removeGroupSeparators(value: string): string {
    return value.replace(/,/g, '');
  }
}
