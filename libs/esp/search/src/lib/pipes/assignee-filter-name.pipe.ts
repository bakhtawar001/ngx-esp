import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assigneeFilterName',
})
export class AssigneeFilterNamePipe implements PipeTransform {
  transform(assignee: string, ...args: any[]): any {
    if (assignee) {
      const assigneeArray = assignee.split(':');

      if (assigneeArray.length) {
        return assigneeArray[0];
      }
    }
    return assignee;
  }
}
