import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'evalDisplayValue',
})
export class EvalDisplayValuePipe implements PipeTransform {
  transform(
    value: any,
    trueDisplay?: any,
    falseDisplay?: any,
    nullDisplay?: any
  ): any {
    let ret = 'No';

    const display = falseDisplay || 'No';

    if (typeof value === 'boolean') {
      if (value) {
        ret = trueDisplay || 'Yes';
      } else {
        ret = falseDisplay || 'No';
      }
    } else if (!value) {
      ret = nullDisplay || display;
    }

    return ret;
  }
}

@NgModule({
  declarations: [EvalDisplayValuePipe],
  exports: [EvalDisplayValuePipe],
})
export class EvalDisplayValuePipeModule {}
